import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { ExampleService } from './example.service';
import { ExampleController } from './example.controller';

@Module({
  imports: [
    PrismaModule
  ],
  providers: [ExampleService],
  exports: [ExampleService],
  controllers: [ExampleController],
})
export class ExampleModule {}
