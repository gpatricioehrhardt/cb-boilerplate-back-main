import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Patch,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { LoggerService } from '../common/logger/logger.service';
import { Context } from '../common/context/context.service';
import { CreateProjetoDto } from './dto/create-projeto.dto';
import { UpdateProjetoDto } from './dto/update-projeto.dto';
import { ProjetoService } from './projeto.service';
import { ProjetoStatus } from './model/projeto.model';

@ApiTags('Projects')
@ApiBearerAuth('token')
@Controller('projetos')
export class ProjetoController {
  constructor(
    private readonly logger: LoggerService,
    private readonly projetoService: ProjetoService,
    private readonly context: Context,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new project' })
  @ApiResponse({ status: 201, description: 'Project created successfully.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  create(@Body() dto: CreateProjetoDto) {
    return this.projetoService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all projects' })
  @ApiResponse({ status: 200, description: 'Projects retrieved successfully.' })
  @ApiQuery({ name: 'gestorId', required: false, description: 'Filter by manager ID' })
  findAll(@Query('gestorId') gestorId?: string) {
    if (gestorId) {
      return this.projetoService.findByGestor(+gestorId);
    }
    return this.projetoService.findAll();
  }

  @Get('active')
  @ApiOperation({ summary: 'Get active projects' })
  @ApiResponse({ status: 200, description: 'Active projects retrieved successfully.' })
  findActive() {
    return this.projetoService.findActive();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a project by ID' })
  @ApiResponse({ status: 200, description: 'Project retrieved successfully.' })
  @ApiResponse({ status: 404, description: 'Project not found.' })
  findOne(@Param('id') id: string) {
    return this.projetoService.findOne(+id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a project' })
  @ApiResponse({ status: 200, description: 'Project updated successfully.' })
  @ApiResponse({ status: 404, description: 'Project not found.' })
  update(@Param('id') id: string, @Body() dto: UpdateProjetoDto) {
    return this.projetoService.update(+id, dto);
  }

  @Patch(':id/status/:status')
  @ApiOperation({ summary: 'Change project status' })
  @ApiResponse({ status: 200, description: 'Project status changed successfully.' })
  @ApiResponse({ status: 404, description: 'Project not found.' })
  changeStatus(@Param('id') id: string, @Param('status') status: string) {
    return this.projetoService.changeStatus(+id, status as ProjetoStatus);
  }
}
