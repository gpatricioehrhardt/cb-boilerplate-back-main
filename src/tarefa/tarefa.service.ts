import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { LoggerService } from '../common/logger/logger.service';
import { CreateTarefaDto } from './dto/create-tarefa.dto';
import { UpdateTarefaDto } from './dto/update-tarefa.dto';

@Injectable()
export class TarefaService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly logger: LoggerService,
  ) {}

  /**
   * Creates a new task
   * @param {CreateTarefaDto} dto - Task data
   * @returns {Promise<Tarefa>} - Task object
   */
  async create(dto: CreateTarefaDto) {
    this.logger.debug('TarefaService - Creating task', { nome: dto.nome, projetoId: dto.projetoId });

    const tarefa = await this.prismaService.tarefa.create({
      data: dto,
      include: {
        projeto: {
          include: {
            gestor: {
              include: {
                perfilDeCusto: true,
              },
            },
          },
        },
      },
    });

    this.logger.debug('TarefaService - Task created successfully', { tarefaId: tarefa.id });
    return tarefa;
  }

  /**
   * Find all tasks
   * @returns {Promise<Tarefa[]>} - Array of task objects
   */
  async findAll() {
    return this.prismaService.tarefa.findMany({
      include: {
        projeto: {
          include: {
            gestor: {
              include: {
                perfilDeCusto: true,
              },
            },
          },
        },
      },
      orderBy: {
        nome: 'asc',
      },
    });
  }

  /**
   * Find tasks by project
   * @param {number} projetoId - Project ID
   * @returns {Promise<Tarefa[]>} - Array of task objects
   */
  async findByProjeto(projetoId: number) {
    return this.prismaService.tarefa.findMany({
      where: { projetoId },
      include: {
        projeto: {
          include: {
            gestor: {
              include: {
                perfilDeCusto: true,
              },
            },
          },
        },
      },
      orderBy: {
        nome: 'asc',
      },
    });
  }

  /**
   * Find active tasks by project
   * @param {number} projetoId - Project ID
   * @returns {Promise<Tarefa[]>} - Array of active task objects
   */
  async findActiveByProjeto(projetoId: number) {
    return this.prismaService.tarefa.findMany({
      where: { 
        projetoId,
        ativo: true,
      },
      include: {
        projeto: {
          include: {
            gestor: {
              include: {
                perfilDeCusto: true,
              },
            },
          },
        },
      },
      orderBy: {
        nome: 'asc',
      },
    });
  }

  /**
   * Find a task by ID
   * @param {number} id - Task ID
   * @returns {Promise<Tarefa>} - Task object
   */
  async findOne(id: number) {
    const tarefa = await this.prismaService.tarefa.findUnique({
      where: { id },
      include: {
        projeto: {
          include: {
            gestor: {
              include: {
                perfilDeCusto: true,
              },
            },
          },
        },
      },
    });

    if (!tarefa) {
      throw new NotFoundException('Task not found');
    }

    return tarefa;
  }

  /**
   * Update a task
   * @param {number} id - Task ID
   * @param {UpdateTarefaDto} dto - Update task data
   * @returns {Promise<Tarefa>} - Updated task object
   */
  async update(id: number, dto: UpdateTarefaDto) {
    this.logger.debug('TarefaService - Updating task', { tarefaId: id });

    // Check if task exists
    await this.findOne(id);

    const tarefa = await this.prismaService.tarefa.update({
      where: { id },
      data: dto,
      include: {
        projeto: {
          include: {
            gestor: {
              include: {
                perfilDeCusto: true,
              },
            },
          },
        },
      },
    });

    this.logger.debug('TarefaService - Task updated successfully', { tarefaId: id });
    return tarefa;
  }

  /**
   * Deactivate a task (soft delete)
   * @param {number} id - Task ID
   * @returns {Promise<Tarefa>} - Updated task object
   */
  async deactivate(id: number) {
    this.logger.debug('TarefaService - Deactivating task', { tarefaId: id });

    const tarefa = await this.prismaService.tarefa.update({
      where: { id },
      data: { ativo: false },
      include: {
        projeto: {
          include: {
            gestor: {
              include: {
                perfilDeCusto: true,
              },
            },
          },
        },
      },
    });

    this.logger.debug('TarefaService - Task deactivated successfully', { tarefaId: id });
    return tarefa;
  }

  /**
   * Activate a task
   * @param {number} id - Task ID
   * @returns {Promise<Tarefa>} - Updated task object
   */
  async activate(id: number) {
    this.logger.debug('TarefaService - Activating task', { tarefaId: id });

    const tarefa = await this.prismaService.tarefa.update({
      where: { id },
      data: { ativo: true },
      include: {
        projeto: {
          include: {
            gestor: {
              include: {
                perfilDeCusto: true,
              },
            },
          },
        },
      },
    });

    this.logger.debug('TarefaService - Task activated successfully', { tarefaId: id });
    return tarefa;
  }
}



