import {
  Injectable
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { LoggerService } from 'src/common/logger/logger.service';
import { CreateExampleDto } from './dto/create-example.dto';
import { UpdateExampleDto } from './dto/update-example.dto';

@Injectable()
export class ExampleService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly logger: LoggerService,
  ) { }

  /**
   * Creates a new example record
   * @param {CreateExampleDto} dto - Example data
   * @returns { Promise<Example> } - Example object
   */
  create(dto: CreateExampleDto) {
    return this.prismaService.exampleModel.create({ data: dto });
  }

  /**
 * Find all example records
 * @returns { Promise<[Example]> } - Array of example objects
 */
  findAll() {
    return this.prismaService.exampleModel.findMany();
  }

  /**
   * Find a example record by Id
   * @param {number} id - Example record Id
   * @returns { Promise<Example> } - Example object
   */
  findOne(id: number) {
    return this.prismaService.exampleModel.findUnique({ where: { id } });
  }

  /**
 * Update an example record
 * @param {UpdateExampleDto} dto - Update example data
 * @returns { Promise<Example> } - Updated example object
 */
  update(id: number, dto: UpdateExampleDto) {
    return this.prismaService.exampleModel.update({ where: { id }, data: dto });
  }

}