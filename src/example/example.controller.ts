import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { LoggerService } from '../common/logger/logger.service';
import { Context } from 'src/common/context/context.service';
import { CreateExampleDto } from './dto/create-example.dto';
import { ExampleService } from './example.service';
import { UpdateExampleDto } from './dto/update-example.dto';
//teste 
@ApiTags('Example')
@ApiBearerAuth('token')
@Controller('example')
export class ExampleController {
  constructor(
    private readonly logger: LoggerService,
    private readonly exampleService: ExampleService,
    private readonly context: Context,
  ) { }

  @Post()
  @ApiOperation({ summary: 'Create a example record' })
  @ApiResponse({ status: 201, description: 'Created successfully.' })
  create(@Body() dto: CreateExampleDto) {
    return this.exampleService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all example records' })
  findAll() {
    return this.exampleService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a example record by ID' })
  findOne(@Param('id') id: string) {
    return this.exampleService.findOne(+id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a example record' })
  update(@Param('id') id: string, @Body() dto: UpdateExampleDto) {
    return this.exampleService.update(+id, dto);
  }

}
