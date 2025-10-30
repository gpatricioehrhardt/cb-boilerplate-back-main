import { Global, Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: 'JWT_AUTH_SERVICE',
      useFactory: (configService: ConfigService) => {
        return new JwtService({
          secret: configService.get<string>('JWT_SECRET'),
          signOptions: {
            expiresIn: configService.get<string>('JWT_EXPIRES_IN') || '1h',
          },
        });
      },
      inject: [ConfigService],
    },
    {
      provide: 'JWT_REFRESH_SERVICE',
      useFactory: (configService: ConfigService) => {
        return new JwtService({
          secret: configService.get<string>('JWT_REFRESH_SECRET'),
          signOptions: {
            expiresIn: configService.get<string>('JWT_REFRESH_EXPIRES_IN') || '2d',
          },
        });
      },
      inject: [ConfigService],
    },
  ],
  exports: ['JWT_AUTH_SERVICE', 'JWT_REFRESH_SERVICE'],
})
export class JwtAppModule {}
