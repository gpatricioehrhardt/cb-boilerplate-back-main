import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Patch,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { LoggerService } from '../common/logger/logger.service';
import { Context } from '../common/context/context.service';
import { CreatePerfilDeCustoDto } from './dto/create-perfil-de-custo.dto';
import { UpdatePerfilDeCustoDto } from './dto/update-perfil-de-custo.dto';
import { PerfilDeCustoService } from './perfil-de-custo.service';

@ApiTags('Cost Profiles')
@ApiBearerAuth('token')
@Controller('perfil-de-custo')
export class PerfilDeCustoController {
  constructor(
    private readonly logger: LoggerService,
    private readonly perfilDeCustoService: PerfilDeCustoService,
    private readonly context: Context,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new cost profile' })
  @ApiResponse({ status: 201, description: 'Cost profile created successfully.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  create(@Body() dto: CreatePerfilDeCustoDto) {
    return this.perfilDeCustoService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all cost profiles' })
  @ApiResponse({ status: 200, description: 'Cost profiles retrieved successfully.' })
  findAll() {
    return this.perfilDeCustoService.findAll();
  }

  @Get('active')
  @ApiOperation({ summary: 'Get active cost profiles' })
  @ApiResponse({ status: 200, description: 'Active cost profiles retrieved successfully.' })
  findActive() {
    return this.perfilDeCustoService.findActive();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a cost profile by ID' })
  @ApiResponse({ status: 200, description: 'Cost profile retrieved successfully.' })
  @ApiResponse({ status: 404, description: 'Cost profile not found.' })
  findOne(@Param('id') id: string) {
    return this.perfilDeCustoService.findOne(+id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a cost profile' })
  @ApiResponse({ status: 200, description: 'Cost profile updated successfully.' })
  @ApiResponse({ status: 404, description: 'Cost profile not found.' })
  update(@Param('id') id: string, @Body() dto: UpdatePerfilDeCustoDto) {
    return this.perfilDeCustoService.update(+id, dto);
  }

  @Patch(':id/activate')
  @ApiOperation({ summary: 'Activate a cost profile' })
  @ApiResponse({ status: 200, description: 'Cost profile activated successfully.' })
  @ApiResponse({ status: 404, description: 'Cost profile not found.' })
  activate(@Param('id') id: string) {
    return this.perfilDeCustoService.activate(+id);
  }

  @Patch(':id/deactivate')
  @ApiOperation({ summary: 'Deactivate a cost profile' })
  @ApiResponse({ status: 200, description: 'Cost profile deactivated successfully.' })
  @ApiResponse({ status: 404, description: 'Cost profile not found.' })
  deactivate(@Param('id') id: string) {
    return this.perfilDeCustoService.deactivate(+id);
  }
}



