import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoggerService } from '../common/logger/logger.service';
import { Context } from '../common/context/context.service';
import { ApontamentoService } from './apontamento.service';
import { BaterPontoDto } from './dto/bater-ponto.dto';
import { LancarTimesheetDto } from './dto/lancar-timesheet.dto';

@ApiTags('Apontamento')
@ApiBearerAuth('token')
@Controller('apontamento')
export class ApontamentoController {
  constructor(
    private readonly logger: LoggerService,
    private readonly service: ApontamentoService,
    private readonly context: Context,
  ) {}

  @Post('ponto/bater')
  @ApiOperation({ summary: 'Registrar batida de ponto (entrada/saída/intervalos)' })
  @ApiResponse({ status: 201, description: 'Batida registrada com sucesso.' })
  baterPonto(@Body() dto: BaterPontoDto) {
    return this.service.baterPonto(dto);
  }

  @Post('timesheet')
  @ApiOperation({ summary: 'Lançar horas em projeto/tarefa (timesheet manual)' })
  @ApiResponse({ status: 201, description: 'Lançamento registrado com sucesso.' })
  lancarTimesheet(@Body() dto: LancarTimesheetDto) {
    return this.service.lancarTimesheet(dto);
  }

  @Get('banco-horas/:userId/saldo')
  @ApiOperation({ summary: 'Consultar saldo do banco de horas do usuário' })
  saldoBancoHoras(@Param('userId') userId: string) {
    return this.service.saldoBancoHoras(+userId);
  }
}



