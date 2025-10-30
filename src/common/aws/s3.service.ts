import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Client, ListObjectsV2Command } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { GetObjectCommand } from '@aws-sdk/client-s3';
import { LoggerService } from '../logger/logger.service';

@Injectable()
export class S3Service {
  private s3Client: S3Client;
  private bucketName: string;
  private s3PresignedExpiresInSeconds;

  constructor(
    private readonly configService: ConfigService,
    private readonly logger: LoggerService,
  ) {
    const isLocalStack = this.configService.get('AWS_ENDPOINT_URL');
    this.s3PresignedExpiresInSeconds = this.configService.get(
      'AWS_S3_PRE_SIGN_EXPIRATION_SECONDS',
      '3600',
    );
    if (isLocalStack) {
      this.s3Client = new S3Client({
        region: this.configService.get('AWS_REGION', 'us-east-1'),
        endpoint: this.configService.get('AWS_ENDPOINT_URL') || undefined,
        credentials: {
          accessKeyId: this.configService.get('AWS_ACCESS_KEY_ID', 'test'),
          secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY', 'test'),
        },
        forcePathStyle: !!isLocalStack, // Importante para LocalStack
      });
    } else {
      this.s3Client = new S3Client({
        region: this.configService.get('AWS_REGION'),
      });
    }
    this.bucketName = this.configService.get('AWS_S3_BUCKET_NAME') || '';
  }

  async getPresignedUrl(
    key: string,
    expiresIn = this.s3PresignedExpiresInSeconds,
  ): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: key,
      ResponseContentDisposition: 'inline',
    });

    return getSignedUrl(this.s3Client, command, { expiresIn });
  }

  async getAllFolders(folderPrefix: string): Promise<string[] | []> {
    try {
      const command = new ListObjectsV2Command({
        Bucket: this.bucketName,
        Prefix: folderPrefix,
        Delimiter: '/',
      });

      const response = await this.s3Client.send(command);
      if (!response.CommonPrefixes || response.CommonPrefixes.length === 0) {
        return [];
      }

      const folders = response.CommonPrefixes.map(
        (prefix) => prefix.Prefix?.replace(folderPrefix, '').replace('/', '') || '',
      );
      return folders.sort((a, b) => {
        const dateA = new Date(a).getTime();
        const dateB = new Date(b).getTime();
        return dateB - dateA; // Descending order
      });
    } catch (error) {
      this.logger.error('Error getting all folders:', error);
      throw new Error('Failed to get folders');
    }
  }

  async getRecentFolder(folderPrefix: string): Promise<string | null> {
    try {
      const command = new ListObjectsV2Command({
        Bucket: this.bucketName,
        Prefix: folderPrefix,
        Delimiter: '/',
      });

      const response = await this.s3Client.send(command);
      if (!response.CommonPrefixes || response.CommonPrefixes.length === 0) {
        return null;
      }

      // Extrair nomes das pastas e ordenar por data
      const folderNames = response.CommonPrefixes.map((prefix) => {
        const folderName = prefix.Prefix?.replace(folderPrefix, '').replace('/', '');
        return {
          name: folderName,
          prefix: prefix.Prefix,
          timestamp: folderName ? new Date(folderName).getTime() : 0,
        };
      })
        .filter((item) => item.name && !isNaN(item.timestamp))
        .sort((a, b) => b.timestamp - a.timestamp);

      return folderNames.length > 0 && folderNames[0].name
        ? `${folderPrefix}${folderNames[0].name}`
        : null;
    } catch (error) {
      this.logger.error('Error getting latest release folder:', error);
      throw new Error('Failed to get latest release folder');
    }
  }

  async getObjectByKey(key: string): Promise<any> {
    try {
      const command = new GetObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      });

      const response = await this.s3Client.send(command);

      if (!response.Body) {
        throw new Error(`Object not found: ${key}`);
      }

      // Converter stream para buffer se necessário
      const bodyContents = await response.Body.transformToByteArray();

      return {
        body: bodyContents,
        contentType: response.ContentType,
        contentLength: response.ContentLength,
        lastModified: response.LastModified,
        metadata: response.Metadata,
      };
    } catch (error) {
      this.logger.error('Error getting object by key:', error);
      throw new Error(`Failed to get object: ${key}`);
    }
  }
}
