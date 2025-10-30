import 'newrelic';
import { ValidationPipe, RequestMethod } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { LoggerService } from './common/logger/logger.service';
import { AppModule } from './app.module';
import { I18nMiddleware } from 'nestjs-i18n';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT') || 4000;

  // Validação global
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  // Configuração de CORS
  app.enableCors({
    origin: (configService.get<string>('ALLOWED_ORIGIN') || ('*' as string)).split(','),
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  });

  app.setGlobalPrefix('api/v1', {
    exclude: [{ path: 'healthcheck', method: RequestMethod.GET }], // Exclui "/health"
  });

  // Logger
  const logger = app.get(LoggerService);

  // Swagger
  const config = new DocumentBuilder()
    .setTitle('My App API')
    .setDescription('API for my App')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
      'token',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: {},
  });

  //Internationalization
  app.use(I18nMiddleware);

  await app.listen(port);

  logger.info(`Server running on: http://localhost:${port}`, { key: 'value' });
}

void bootstrap();
