import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { TarefaService } from './tarefa.service';
import { TarefaController } from './tarefa.controller';

@Module({
  imports: [PrismaModule],
  providers: [TarefaService],
  exports: [TarefaService],
  controllers: [TarefaController],
})
export class TarefaModule {}



