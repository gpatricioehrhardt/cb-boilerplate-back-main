// src/app.module.ts
import { Module, NestModule, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { HealthCheckController } from './health/health-check.controller';
import { LoggerModule } from './common/logger/logger.module';
import { HttpContextMiddleware } from './common/middleware/http.context.middleware';
import { HttpClientModule } from './common/http/http.client.module';
import { ContextModule } from './common/context/context.module';
import { JwtAppModule } from './common/jwt/jwt.module';
import { AppVersionModule } from './app-version/app-version.module';
import { AppVersionController } from './app-version/app-version.controller';
import { S3Module } from './common/aws/s3.module';
import { ExampleModule } from './example/example.module';
import { UserModule } from './user/user.module';
import { PerfilDeCustoModule } from './perfil-de-custo/perfil-de-custo.module';
import { ProjetoModule } from './projeto/projeto.module';
import { TarefaModule } from './tarefa/tarefa.module';
import { ApontamentoModule } from './apontamento/apontamento.module';
import { RelatoriosModule } from './relatorios/relatorios.module';
import { I18nModule, QueryResolver, AcceptLanguageResolver } from 'nestjs-i18n';
import * as path from 'path';

const i18nPath =
  process.env.NODE_ENV === 'production'
    ? path.join(__dirname, '/i18n/') // build
    : path.resolve(process.cwd(), 'src/i18n/'); // dev

@Module({
  controllers: [HealthCheckController, AppVersionController],
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    JwtAppModule,
    PrismaModule,
    LoggerModule,
    ContextModule,
    HttpClientModule,
    ExampleModule,
    UserModule,
    PerfilDeCustoModule,
    ProjetoModule,
    TarefaModule,
    ApontamentoModule,
    RelatoriosModule,
    S3Module,
    AppVersionModule,

    I18nModule.forRoot({
      fallbackLanguage: 'pt',
      loaderOptions: {
        path: i18nPath,
        watch: true,
      },
      resolvers: [{ use: QueryResolver, options: ['lang', 'locale', 'l'] }, AcceptLanguageResolver],
    }),
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(HttpContextMiddleware).forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
