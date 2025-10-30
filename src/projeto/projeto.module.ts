import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { ProjetoService } from './projeto.service';
import { ProjetoController } from './projeto.controller';

@Module({
  imports: [PrismaModule],
  providers: [ProjetoService],
  exports: [ProjetoService],
  controllers: [ProjetoController],
})
export class ProjetoModule {}



