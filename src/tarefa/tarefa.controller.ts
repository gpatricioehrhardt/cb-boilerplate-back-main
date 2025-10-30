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
import { CreateTarefaDto } from './dto/create-tarefa.dto';
import { UpdateTarefaDto } from './dto/update-tarefa.dto';
import { TarefaService } from './tarefa.service';

@ApiTags('Tasks')
@ApiBearerAuth('token')
@Controller('tarefas')
export class TarefaController {
  constructor(
    private readonly logger: LoggerService,
    private readonly tarefaService: TarefaService,
    private readonly context: Context,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new task' })
  @ApiResponse({ status: 201, description: 'Task created successfully.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  create(@Body() dto: CreateTarefaDto) {
    return this.tarefaService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all tasks' })
  @ApiResponse({ status: 200, description: 'Tasks retrieved successfully.' })
  @ApiQuery({ name: 'projetoId', required: false, description: 'Filter by project ID' })
  findAll(@Query('projetoId') projetoId?: string) {
    if (projetoId) {
      return this.tarefaService.findByProjeto(+projetoId);
    }
    return this.tarefaService.findAll();
  }

  @Get('active')
  @ApiOperation({ summary: 'Get active tasks by project' })
  @ApiResponse({ status: 200, description: 'Active tasks retrieved successfully.' })
  @ApiQuery({ name: 'projetoId', required: true, description: 'Project ID' })
  findActiveByProjeto(@Query('projetoId') projetoId: string) {
    return this.tarefaService.findActiveByProjeto(+projetoId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a task by ID' })
  @ApiResponse({ status: 200, description: 'Task retrieved successfully.' })
  @ApiResponse({ status: 404, description: 'Task not found.' })
  findOne(@Param('id') id: string) {
    return this.tarefaService.findOne(+id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a task' })
  @ApiResponse({ status: 200, description: 'Task updated successfully.' })
  @ApiResponse({ status: 404, description: 'Task not found.' })
  update(@Param('id') id: string, @Body() dto: UpdateTarefaDto) {
    return this.tarefaService.update(+id, dto);
  }

  @Patch(':id/activate')
  @ApiOperation({ summary: 'Activate a task' })
  @ApiResponse({ status: 200, description: 'Task activated successfully.' })
  @ApiResponse({ status: 404, description: 'Task not found.' })
  activate(@Param('id') id: string) {
    return this.tarefaService.activate(+id);
  }

  @Patch(':id/deactivate')
  @ApiOperation({ summary: 'Deactivate a task' })
  @ApiResponse({ status: 200, description: 'Task deactivated successfully.' })
  @ApiResponse({ status: 404, description: 'Task not found.' })
  deactivate(@Param('id') id: string) {
    return this.tarefaService.deactivate(+id);
  }
}



