import { Controller, Get, Query, HttpStatus, HttpException, Res } from '@nestjs/common';
import { AppVersionService } from './app-version.service';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { LoggerService } from '../common/logger/logger.service';
import { Response } from 'express';

@ApiTags('App Version')
@ApiBearerAuth('token')
@Controller('/app/versions')
export class AppVersionController {
  constructor(
    private readonly logger: LoggerService,
    private readonly appVersionService: AppVersionService,
  ) {}

  validateApiKey(apiKey: string) {
    const errorMessage = 'Acesso não autorizado';
    if (!apiKey) {
      this.logger.warn('API key is required to get the latest app version', { apiKey });
      throw new HttpException(errorMessage, HttpStatus.UNAUTHORIZED);
    }
    if (apiKey !== process.env.API_KEY) {
      this.logger.warn('Invalid API key provided', { apiKey });
      throw new HttpException(errorMessage, HttpStatus.UNAUTHORIZED);
    }
    return;
  }

  @Get()
  @ApiOperation({ summary: 'Get latest app version' })
  async getAll(@Query('apiKey') apiKey: string) {
    this.validateApiKey(apiKey);
    try {
      const result = await this.appVersionService.getAll();
      return result;
    } catch (error) {
      this.logger.error('AppVersionControllerError: Failed to get all app versions', error.stack);
      throw error;
    }
  }

  @Get('latest')
  @ApiOperation({ summary: 'Get latest app version' })
  async getLatest(
    @Query('apiKey') apiKey: string,
    @Query('location') location: boolean = false,
    @Res({ passthrough: true }) res: Response,
  ) {
    this.validateApiKey(apiKey);
    try {
      const result = await this.appVersionService.getLatestAppVersion();
      if (location) {
        res.setHeader('Location', result.downloadUrl);
        res.status(HttpStatus.FOUND);
      }
      return result;
    } catch (error) {
      this.logger.error('AppVersionControllerError: Failed to get latest app version', error.stack);
      throw error;
    }
  }
}
