import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { LoggerService } from '../common/logger/logger.service';
import { CreatePerfilDeCustoDto } from './dto/create-perfil-de-custo.dto';
import { UpdatePerfilDeCustoDto } from './dto/update-perfil-de-custo.dto';

@Injectable()
export class PerfilDeCustoService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly logger: LoggerService,
  ) {}

  /**
   * Creates a new cost profile
   * @param {CreatePerfilDeCustoDto} dto - Cost profile data
   * @returns {Promise<PerfilDeCusto>} - Cost profile object
   */
  async create(dto: CreatePerfilDeCustoDto) {
    this.logger.debug('PerfilDeCustoService - Creating cost profile', { nome: dto.nome });

    const perfilDeCusto = await this.prismaService.perfilDeCusto.create({
      data: dto,
    });

    this.logger.debug('PerfilDeCustoService - Cost profile created successfully', { id: perfilDeCusto.id });
    return perfilDeCusto;
  }

  /**
   * Find all cost profiles
   * @returns {Promise<PerfilDeCusto[]>} - Array of cost profile objects
   */
  async findAll() {
    return this.prismaService.perfilDeCusto.findMany({
      orderBy: {
        nome: 'asc',
      },
    });
  }

  /**
   * Find active cost profiles
   * @returns {Promise<PerfilDeCusto[]>} - Array of active cost profile objects
   */
  async findActive() {
    return this.prismaService.perfilDeCusto.findMany({
      where: { ativo: true },
      orderBy: {
        nome: 'asc',
      },
    });
  }

  /**
   * Find a cost profile by ID
   * @param {number} id - Cost profile ID
   * @returns {Promise<PerfilDeCusto>} - Cost profile object
   */
  async findOne(id: number) {
    const perfilDeCusto = await this.prismaService.perfilDeCusto.findUnique({
      where: { id },
    });

    if (!perfilDeCusto) {
      throw new NotFoundException('Cost profile not found');
    }

    return perfilDeCusto;
  }

  /**
   * Update a cost profile
   * @param {number} id - Cost profile ID
   * @param {UpdatePerfilDeCustoDto} dto - Update cost profile data
   * @returns {Promise<PerfilDeCusto>} - Updated cost profile object
   */
  async update(id: number, dto: UpdatePerfilDeCustoDto) {
    this.logger.debug('PerfilDeCustoService - Updating cost profile', { id });

    // Check if cost profile exists
    await this.findOne(id);

    const perfilDeCusto = await this.prismaService.perfilDeCusto.update({
      where: { id },
      data: dto,
    });

    this.logger.debug('PerfilDeCustoService - Cost profile updated successfully', { id });
    return perfilDeCusto;
  }

  /**
   * Deactivate a cost profile (soft delete)
   * @param {number} id - Cost profile ID
   * @returns {Promise<PerfilDeCusto>} - Updated cost profile object
   */
  async deactivate(id: number) {
    this.logger.debug('PerfilDeCustoService - Deactivating cost profile', { id });

    const perfilDeCusto = await this.prismaService.perfilDeCusto.update({
      where: { id },
      data: { ativo: false },
    });

    this.logger.debug('PerfilDeCustoService - Cost profile deactivated successfully', { id });
    return perfilDeCusto;
  }

  /**
   * Activate a cost profile
   * @param {number} id - Cost profile ID
   * @returns {Promise<PerfilDeCusto>} - Updated cost profile object
   */
  async activate(id: number) {
    this.logger.debug('PerfilDeCustoService - Activating cost profile', { id });

    const perfilDeCusto = await this.prismaService.perfilDeCusto.update({
      where: { id },
      data: { ativo: true },
    });

    this.logger.debug('PerfilDeCustoService - Cost profile activated successfully', { id });
    return perfilDeCusto;
  }
}



