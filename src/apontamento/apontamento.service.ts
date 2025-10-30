import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { LoggerService } from '../common/logger/logger.service';
import { BaterPontoDto, TipoBatidaDto } from './dto/bater-ponto.dto';
import { LancarTimesheetDto, ModoRegistroDto } from './dto/lancar-timesheet.dto';

function parseIsoDateOnly(dateStr: string): Date {
  // Force timezone-agnostic date (00:00 local)
  const d = new Date(dateStr + 'T00:00:00');
  if (isNaN(d.getTime())) throw new BadRequestException('Data inválida');
  return d;
}

function mergeDateTime(dateStr: string, timeStr?: string): Date | undefined {
  if (!timeStr) return undefined;
  const [hh, mm] = timeStr.split(':').map(Number);
  if (isNaN(hh) || isNaN(mm)) return undefined;
  const d = new Date(dateStr + `T${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}:00`);
  return isNaN(d.getTime()) ? undefined : d;
}

@Injectable()
export class ApontamentoService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly logger: LoggerService,
  ) {}

  async baterPonto(dto: BaterPontoDto) {
    const data = parseIsoDateOnly(dto.data);

    // Regra: almoço exige 2 batidas; sem arredondamento (não precisa tratar aqui)
    // Permite projetoId (alocação ativa) opcional

    const created = await this.prisma.batidaPonto.create({
      data: {
        userId: dto.userId,
        data,
        tipo: dto.tipo as any,
        projetoId: dto.projetoId,
        observacao: dto.observacao,
      },
    });

    this.logger.debug('ApontamentoService - Batida registrada', { id: created.id, userId: dto.userId, tipo: dto.tipo });
    return created;
  }

  async lancarTimesheet(dto: LancarTimesheetDto, userIdFromToken?: number) {
    const userId = dto.userId ?? userIdFromToken;
    if (!userId) throw new BadRequestException('userId obrigatório');

    const data = parseIsoDateOnly(dto.data);

    // Regra: lançamento manual permitido até 1 jornada/dia — validação simples por soma do dia
    const inicio = mergeDateTime(dto.data, dto.inicio);
    const fim = mergeDateTime(dto.data, dto.fim);

    let horas = dto.horas ?? undefined;
    if (!horas && inicio && fim) {
      const ms = +fim - +inicio;
      if (ms <= 0) throw new BadRequestException('Intervalo inválido');
      horas = Math.round((ms / 3_600_000) * 100) / 100; // 2 casas
    }

    if (!horas || horas <= 0) throw new BadRequestException('Informe horas ou início/fim válidos');

    // Soma de horas manuais por dia (limite 1 jornada = 24h hard, mas tipicamente 8h; aqui aplica 12h prudencial)
    const somaDia = await this.prisma.lancamentoHora.aggregate({
      where: { userId, data },
      _sum: { horas: true },
    });
    const totalDia = Number(somaDia._sum.horas ?? 0) + Number(horas);
    if (totalDia > 12) {
      throw new BadRequestException('Limite diário de lançamentos manuais excedido (12h)');
    }

    // Snapshot de custo/preço do perfil atual do usuário
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { perfilDeCusto: true },
    });
    if (!user) throw new BadRequestException('Usuário inválido');

    const lanc = await this.prisma.lancamentoHora.create({
      data: {
        userId,
        projetoId: dto.projetoId,
        tarefaId: dto.tarefaId,
        data,
        inicio,
        fim,
        horas,
        modoRegistro: (dto.modoRegistro || ModoRegistroDto.TIMESHEET) as any,
        classificacaoColaborador: (dto.classificacaoColaborador || 'NORMAL') as any,
        classificacaoProjeto: (dto.classificacaoProjeto || 'NORMAL') as any,
        perfilDeCustoSnapshotId: user.perfilDeCustoId ?? null,
        custoHoraSnapshot: user.custoHora ?? null,
        precoHoraSnapshot: null,
        ehForaHorario: !!dto.ehForaHorario,
        motivoEdicao: dto.motivoEdicao,
        criadoPor: userId,
        atualizadoPor: userId,
      },
    });

    this.logger.debug('ApontamentoService - Timesheet lançado', { id: lanc.id, userId });
    return lanc;
  }

  async saldoBancoHoras(userId: number) {
    const agg = await this.prisma.bancoHorasMovimento.aggregate({
      where: { userId },
      _sum: { horas: true },
    });
    const saldo = Number(agg._sum.horas ?? 0);
    return { userId, saldo };
  }
}



