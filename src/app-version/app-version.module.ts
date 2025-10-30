import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppVersionService } from './app-version.service';
import { AppVersionController } from './app-version.controller';
import { S3Module } from '../common/aws/s3.module';

@Module({
  imports: [ConfigModule, S3Module],
  controllers: [AppVersionController],
  providers: [AppVersionService],
  exports: [AppVersionService],
})
export class AppVersionModule {}
