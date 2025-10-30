import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { LoggerService } from '../common/logger/logger.service';
import { CreateProjetoDto } from './dto/create-projeto.dto';
import { UpdateProjetoDto } from './dto/update-projeto.dto';
import { ProjetoStatus } from './model/projeto.model';

@Injectable()
export class ProjetoService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly logger: LoggerService,
  ) {}

  /**
   * Creates a new project
   * @param {CreateProjetoDto} dto - Project data
   * @returns {Promise<Projeto>} - Project object
   */
  async create(dto: CreateProjetoDto) {
    this.logger.debug('ProjetoService - Creating project', { nome: dto.nome });

    const projeto = await this.prismaService.projeto.create({
      data: dto,
      include: {
        gestor: {
          include: {
            perfilDeCusto: true,
          },
        },
        tarefas: true,
        estimativas: {
          include: {
            perfilDeCusto: true,
          },
        },
        contratos: {
          include: {
            perfilDeCusto: true,
          },
        },
        parcelas: true,
      },
    });

    this.logger.debug('ProjetoService - Project created successfully', { projetoId: projeto.id });
    return projeto;
  }

  /**
   * Find all projects
   * @returns {Promise<Projeto[]>} - Array of project objects
   */
  async findAll() {
    return this.prismaService.projeto.findMany({
      include: {
        gestor: {
          include: {
            perfilDeCusto: true,
          },
        },
        tarefas: true,
        estimativas: {
          include: {
            perfilDeCusto: true,
          },
        },
        contratos: {
          include: {
            perfilDeCusto: true,
          },
        },
        parcelas: true,
      },
      orderBy: {
        nome: 'asc',
      },
    });
  }

  /**
   * Find active projects
   * @returns {Promise<Projeto[]>} - Array of active project objects
   */
  async findActive() {
    return this.prismaService.projeto.findMany({
      where: { status: 'ATIVO' },
      include: {
        gestor: {
          include: {
            perfilDeCusto: true,
          },
        },
        tarefas: true,
        estimativas: {
          include: {
            perfilDeCusto: true,
          },
        },
        contratos: {
          include: {
            perfilDeCusto: true,
          },
        },
        parcelas: true,
      },
      orderBy: {
        nome: 'asc',
      },
    });
  }

  /**
   * Find projects by manager
   * @param {number} gestorId - Manager ID
   * @returns {Promise<Projeto[]>} - Array of project objects
   */
  async findByGestor(gestorId: number) {
    return this.prismaService.projeto.findMany({
      where: { gestorId },
      include: {
        gestor: {
          include: {
            perfilDeCusto: true,
          },
        },
        tarefas: true,
        estimativas: {
          include: {
            perfilDeCusto: true,
          },
        },
        contratos: {
          include: {
            perfilDeCusto: true,
          },
        },
        parcelas: true,
      },
      orderBy: {
        nome: 'asc',
      },
    });
  }

  /**
   * Find a project by ID
   * @param {number} id - Project ID
   * @returns {Promise<Projeto>} - Project object
   */
  async findOne(id: number) {
    const projeto = await this.prismaService.projeto.findUnique({
      where: { id },
      include: {
        gestor: {
          include: {
            perfilDeCusto: true,
          },
        },
        tarefas: true,
        estimativas: {
          include: {
            perfilDeCusto: true,
          },
        },
        contratos: {
          include: {
            perfilDeCusto: true,
          },
        },
        parcelas: true,
      },
    });

    if (!projeto) {
      throw new NotFoundException('Project not found');
    }

    return projeto;
  }

  /**
   * Update a project
   * @param {number} id - Project ID
   * @param {UpdateProjetoDto} dto - Update project data
   * @returns {Promise<Projeto>} - Updated project object
   */
  async update(id: number, dto: UpdateProjetoDto) {
    this.logger.debug('ProjetoService - Updating project', { projetoId: id });

    // Check if project exists
    await this.findOne(id);

    const projeto = await this.prismaService.projeto.update({
      where: { id },
      data: dto,
      include: {
        gestor: {
          include: {
            perfilDeCusto: true,
          },
        },
        tarefas: true,
        estimativas: {
          include: {
            perfilDeCusto: true,
          },
        },
        contratos: {
          include: {
            perfilDeCusto: true,
          },
        },
        parcelas: true,
      },
    });

    this.logger.debug('ProjetoService - Project updated successfully', { projetoId: id });
    return projeto;
  }

  /**
   * Change project status
   * @param {number} id - Project ID
   * @param {ProjetoStatus} status - New status
   * @returns {Promise<Projeto>} - Updated project object
   */
  async changeStatus(id: number, status: ProjetoStatus) {
    this.logger.debug('ProjetoService - Changing project status', { projetoId: id, status });

    const projeto = await this.prismaService.projeto.update({
      where: { id },
      data: { status },
      include: {
        gestor: {
          include: {
            perfilDeCusto: true,
          },
        },
        tarefas: true,
        estimativas: {
          include: {
            perfilDeCusto: true,
          },
        },
        contratos: {
          include: {
            perfilDeCusto: true,
          },
        },
        parcelas: true,
      },
    });

    this.logger.debug('ProjetoService - Project status changed successfully', { projetoId: id });
    return projeto;
  }
}
