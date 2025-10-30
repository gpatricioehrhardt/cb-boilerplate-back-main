import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { RelatoriosController } from './relatorios.controller';
import { RelatoriosService } from './relatorios.service';

@Module({
  imports: [PrismaModule],
  providers: [RelatoriosService],
  controllers: [RelatoriosController],
  exports: [RelatoriosService],
})
export class RelatoriosModule {}



