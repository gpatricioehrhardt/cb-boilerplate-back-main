import { Injectable, Logger } from '@nestjs/common';
import { S3Service } from '../common/aws/s3.service';
import { Build } from './model/build.model';

@Injectable()
export class AppVersionService {
  private readonly logger = new Logger(AppVersionService.name);

  constructor(private s3Service: S3Service) {}

  async getAll(): Promise<
    Array<{
      downloadUrl: string;
      versionCode: number;
      versionName: string;
      timestamp: string;
      commit: string;
    }>
  > {
    try {
      const prefix = 'app/releases/';
      const versions = await this.s3Service.getAllFolders(prefix);
      if (!versions || versions.length === 0) {
        this.logger.warn('AppVersionService: No app versions found in S3');
        return [];
      }
      const builds = await Promise.all(
        versions.map(async (version) => {
          try {
            const s3BuildFile = await this.s3Service.getObjectByKey(
              `${prefix}${version}/build.json`,
            );
            const buildJsonString = Buffer.from(s3BuildFile.body).toString('utf-8');
            const buildData = JSON.parse(buildJsonString);
            const build: Build = Build.fromJson(buildData);
            const downloadUrl = await this.s3Service.getPresignedUrl(build.path);
            return {
              downloadUrl,
              versionName: build.versionName,
              versionCode: build.versionCode,
              timestamp: build.timestamp,
              commit: build.commit,
            };
          } catch (error) {
            this.logger.error(
              `AppVersionService: Failed to process build for version ${version}: ${error.message}`,
            );
            return null;
          }
        }),
      );
      return builds.filter((build) => build !== null);
    } catch (error) {
      this.logger.error('AppVersionServiceError: Failed to get all app versions', error.stack);
      return [];
    }
  }

  async getLatestAppVersion(): Promise<{
    downloadUrl: string;
    versionCode: number;
    versionName: string;
    timestamp: string;
    commit: string;
  }> {
    try {
      const recentFolder = await this.s3Service.getRecentFolder('app/releases/');
      if (!recentFolder) {
        this.logger.warn('AppVersionService: No release folders found in S3');
        throw new Error('No app versions available');
      }

      const s3BuildFile = await this.s3Service.getObjectByKey(`${recentFolder}/build.json`);
      if (!s3BuildFile) {
        this.logger.warn(`AppVersionService: No build.json found in folder: ${recentFolder}`);
        throw new Error('No build information available');
      }
      const buildJsonString = Buffer.from(s3BuildFile.body).toString('utf-8');
      const buildData = JSON.parse(buildJsonString);
      const build: Build = Build.fromJson(buildData);
      const downloadUrl = await this.s3Service.getPresignedUrl(build.path);

      return {
        downloadUrl,
        versionName: build.versionName,
        versionCode: build.versionCode,
        timestamp: build.timestamp,
        commit: build.commit,
      };
    } catch (error) {
      this.logger.error('AppVersionServiceError: Failed to get latest app version', error.stack);
      throw error;
    }
  }
}
