import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { LoggerService } from '../common/logger/logger.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly logger: LoggerService,
  ) {}

  /**
   * Creates a new user
   * @param {CreateUserDto} dto - User data
   * @returns {Promise<User>} - User object
   */
  async create(dto: CreateUserDto) {
    this.logger.debug('UserService - Creating user', { email: dto.email });

    // Hash password
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = await this.prismaService.user.create({
      data: {
        ...dto,
        password: hashedPassword,
      },
      include: {
        perfilDeCusto: true,
      },
    });

    this.logger.debug('UserService - User created successfully', { userId: user.id });
    return user;
  }

  /**
   * Find all users
   * @returns {Promise<User[]>} - Array of user objects
   */
  async findAll() {
    return this.prismaService.user.findMany({
      include: {
        perfilDeCusto: true,
      },
      orderBy: {
        name: 'asc',
      },
    });
  }

  /**
   * Find a user by ID
   * @param {number} id - User ID
   * @returns {Promise<User>} - User object
   */
  async findOne(id: number) {
    const user = await this.prismaService.user.findUnique({
      where: { id },
      include: {
        perfilDeCusto: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  /**
   * Find a user by email
   * @param {string} email - User email
   * @returns {Promise<User>} - User object
   */
  async findByEmail(email: string) {
    return this.prismaService.user.findUnique({
      where: { email },
      include: {
        perfilDeCusto: true,
      },
    });
  }

  /**
   * Update a user
   * @param {number} id - User ID
   * @param {UpdateUserDto} dto - Update user data
   * @returns {Promise<User>} - Updated user object
   */
  async update(id: number, dto: UpdateUserDto) {
    this.logger.debug('UserService - Updating user', { userId: id });

    // Check if user exists
    await this.findOne(id);

    const updateData: any = { ...dto };

    // Hash password if provided
    if (dto.password) {
      updateData.password = await bcrypt.hash(dto.password, 10);
    }

    const user = await this.prismaService.user.update({
      where: { id },
      data: updateData,
      include: {
        perfilDeCusto: true,
      },
    });

    this.logger.debug('UserService - User updated successfully', { userId: id });
    return user;
  }

  /**
   * Deactivate a user (soft delete)
   * @param {number} id - User ID
   * @returns {Promise<User>} - Updated user object
   */
  async deactivate(id: number) {
    this.logger.debug('UserService - Deactivating user', { userId: id });

    const user = await this.prismaService.user.update({
      where: { id },
      data: { ativo: false },
      include: {
        perfilDeCusto: true,
      },
    });

    this.logger.debug('UserService - User deactivated successfully', { userId: id });
    return user;
  }

  /**
   * Activate a user
   * @param {number} id - User ID
   * @returns {Promise<User>} - Updated user object
   */
  async activate(id: number) {
    this.logger.debug('UserService - Activating user', { userId: id });

    const user = await this.prismaService.user.update({
      where: { id },
      data: { ativo: true },
      include: {
        perfilDeCusto: true,
      },
    });

    this.logger.debug('UserService - User activated successfully', { userId: id });
    return user;
  }
}



