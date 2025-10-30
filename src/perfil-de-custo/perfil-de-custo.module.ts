import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { PerfilDeCustoService } from './perfil-de-custo.service';
import { PerfilDeCustoController } from './perfil-de-custo.controller';

@Module({
  imports: [PrismaModule],
  providers: [PerfilDeCustoService],
  exports: [PerfilDeCustoService],
  controllers: [PerfilDeCustoController],
})
export class PerfilDeCustoModule {}



