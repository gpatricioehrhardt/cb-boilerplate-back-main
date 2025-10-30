import { Controller, Get, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoggerService } from '../common/logger/logger.service';
import { Context } from '../common/context/context.service';
import { RelatoriosService } from './relatorios.service';
import { FiltrosRelatorioDto } from './dto/filtros-relatorio.dto';

@ApiTags('Relatórios')
@ApiBearerAuth('token')
@Controller('relatorios')
export class RelatoriosController {
  constructor(
    private readonly logger: LoggerService,
    private readonly service: RelatoriosService,
    private readonly context: Context,
  ) {}

  @Get('horas-por-projeto-mes')
  @ApiOperation({
    summary: 'Relatório de horas por projeto/mês',
    description: 'Retorna horas contratadas (alocação) ou estimadas (escopo fechado), realizadas, extras, custo, receita e margem',
  })
  @ApiResponse({ status: 200, description: 'Relatório gerado com sucesso.' })
  horasPorProjetoMes(@Query() filtros: FiltrosRelatorioDto) {
    return this.service.relatorioHorasPorProjetoMes(filtros);
  }

  @Get('horas-por-colaborador')
  @ApiOperation({
    summary: 'Relatório de horas por colaborador',
    description: 'Retorna horas por projeto/tarefa, extras, banco, horas não justificadas, ausências e banco utilizado',
  })
  @ApiResponse({ status: 200, description: 'Relatório gerado com sucesso.' })
  horasPorColaborador(@Query() filtros: FiltrosRelatorioDto) {
    return this.service.relatorioHorasPorColaborador(filtros);
  }

  @Get('compliance')
  @ApiOperation({
    summary: 'Relatório de compliance de apontamento',
    description: 'Retorna horas esperadas vs registradas, batidas ausentes, lançamentos manuais e lembretes',
  })
  @ApiResponse({ status: 200, description: 'Relatório gerado com sucesso.' })
  compliance(@Query() filtros: FiltrosRelatorioDto) {
    return this.service.relatorioCompliance(filtros);
  }

  @Get('rentabilidade')
  @ApiOperation({
    summary: 'Relatório de rentabilidade por projeto',
    description: 'Calcula rentabilidade para projetos Escopo Fechado e Alocação',
  })
  @ApiResponse({ status: 200, description: 'Relatório gerado com sucesso.' })
  rentabilidade(@Query() filtros: FiltrosRelatorioDto) {
    return this.service.relatorioRentabilidade(filtros);
  }

  @Get('capacidade-alocacao')
  @ApiOperation({
    summary: 'Relatório de capacidade e alocação',
    description: 'Retorna carga do time vs capacidade, distribuição por projeto/perfil',
  })
  @ApiResponse({ status: 200, description: 'Relatório gerado com sucesso.' })
  capacidadeAlocacao(@Query() filtros: FiltrosRelatorioDto) {
    return this.service.relatorioCapacidadeAlocacao(filtros);
  }
}



