import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { ApontamentoController } from './apontamento.controller';
import { ApontamentoService } from './apontamento.service';

@Module({
  imports: [PrismaModule],
  providers: [ApontamentoService],
  controllers: [ApontamentoController],
  exports: [ApontamentoService],
})
export class ApontamentoModule {}



