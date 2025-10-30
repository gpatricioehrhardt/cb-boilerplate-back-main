import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { LoggerService } from '../common/logger/logger.service';
import { FiltrosRelatorioDto } from './dto/filtros-relatorio.dto';

@Injectable()
export class RelatoriosService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly logger: LoggerService,
  ) {}

  async relatorioHorasPorProjetoMes(filtros: FiltrosRelatorioDto) {
    this.logger.debug('RelatoriosService - Gerando relatório de horas por projeto/mês', { filtros });

    // Campos do relatório conforme especificação:
    // - Alocação: horas contratadas mensal, normais, adicionais, extras (fora horário), custo, receita, margem
    // - Escopo Fechado: estimadas, realizadas no mês, acumuladas, saldo, extras, custo, receita, margem

    const where: any = {};
    if (filtros.dataInicio && filtros.dataFim) {
      where.data = { gte: new Date(filtros.dataInicio), lte: new Date(filtros.dataFim) };
    }
    if (filtros.projetoId) where.projetoId = filtros.projetoId;
    if (filtros.colaboradorId) where.userId = filtros.colaboradorId;
    if (filtros.perfilId) where.perfilDeCustoSnapshotId = filtros.perfilId;

    const lancamentos = await this.prisma.lancamentoHora.findMany({
      where,
      include: {
        projeto: {
          include: {
            gestor: true,
            estimativas: { include: { perfilDeCusto: true } },
            contratos: { include: { perfilDeCusto: true } },
            parcelas: true,
          },
        },
        user: { include: { perfilDeCusto: true } },
        tarefa: true,
        perfilDeCustoSnapshot: true,
      },
      orderBy: [{ projeto: { nome: 'asc' } }, { data: 'asc' }],
    });

    // Agrupar por projeto e mês
    const agrupado = lancamentos.reduce((acc, lanc) => {
      const key = `${lanc.projetoId}-${lanc.data.toISOString().slice(0, 7)}`;
      if (!acc[key]) {
        acc[key] = {
          projeto: lanc.projeto,
          mes: lanc.data.toISOString().slice(0, 7),
          totalHoras: 0,
          horasNormais: 0,
          horasExtras: 0,
          horasAdicionais: 0,
          horasExtrasForaHorario: 0,
          custo: 0,
          receita: 0,
          margem: 0,
        };
      }
      const hrs = Number(lanc.horas ?? 0);
      acc[key].totalHoras += hrs;
      if (lanc.classificacaoProjeto === 'NORMAL') acc[key].horasNormais += hrs;
      if (lanc.classificacaoProjeto === 'EXTRA') {
        acc[key].horasExtras += hrs;
        if (lanc.ehForaHorario) acc[key].horasExtrasForaHorario += hrs;
        acc[key].horasAdicionais += hrs;
      }

      // Calcular custo e receita conforme modelo comercial do projeto
      // Implementação simplificada - aplicar regras de faturamento conforme billingModel
      // TODO: Implementar cálculos detalhados conforme especificação

      return acc;
    }, {} as Record<string, any>);

    return Object.values(agrupado);
  }

  async relatorioHorasPorColaborador(filtros: FiltrosRelatorioDto) {
    this.logger.debug('RelatoriosService - Gerando relatório de horas por colaborador', { filtros });

    const where: any = {};
    if (filtros.dataInicio && filtros.dataFim) {
      where.data = { gte: new Date(filtros.dataInicio), lte: new Date(filtros.dataFim) };
    }
    if (filtros.colaboradorId) where.userId = filtros.colaboradorId;
    if (filtros.projetoId) where.projetoId = filtros.projetoId;
    if (filtros.perfilId) where.perfilDeCustoSnapshotId = filtros.perfilId;

    const lancamentos = await this.prisma.lancamentoHora.findMany({
      where,
      include: {
        user: { include: { perfilDeCusto: true } },
        projeto: true,
        tarefa: true,
      },
      orderBy: [{ user: { name: 'asc' } }, { projeto: { nome: 'asc' } }, { data: 'asc' }],
    });

    // Agrupar por colaborador
    const agrupado = lancamentos.reduce((acc, lanc) => {
      const key = lanc.userId;
      if (!acc[key]) {
        acc[key] = {
          user: lanc.user,
          totalHoras: 0,
          horasPorProjeto: {},
          horasExtras: 0,
          banco: 0,
          saldoBanco: 0,
          horasNaoJustificadas: 0,
          horasAusencia: 0,
          bancoUtilizado: 0,
          bancoMes: 0,
          bancoAcumulado: 0,
        };
      }
      const hrs = Number(lanc.horas ?? 0);
      acc[key].totalHoras += hrs;

      // Agrupar por projeto/tarefa
      const projKey = `${lanc.projeto.nome}-${lanc.tarefa?.nome || 'Sem tarefa'}`;
      acc[key].horasPorProjeto[projKey] = (acc[key].horasPorProjeto[projKey] || 0) + hrs;

      // Classificar horas
      if (lanc.classificacaoColaborador === 'EXTRA') {
        acc[key].horasExtras += hrs;
        // TODO: Calcular banco de horas
      }
      if (lanc.classificacaoColaborador === 'BANCO') {
        acc[key].banco += hrs;
      }

      return acc;
    }, {} as Record<number, any>);

    // Calcular banco de horas
    for (const userId of Object.keys(agrupado).map(Number)) {
      const saldo = await this.prisma.bancoHorasMovimento.aggregate({
        where: { userId },
        _sum: { horas: true },
      });
      agrupado[userId].saldoBanco = Number(saldo._sum.horas ?? 0);
      agrupado[userId].bancoAcumulado = Number(saldo._sum.horas ?? 0);
      // TODO: Calcular banco do mês e utilizado
    }

    return Object.values(agrupado);
  }

  async relatorioCompliance(filtros: FiltrosRelatorioDto) {
    this.logger.debug('RelatoriosService - Gerando relatório de compliance', { filtros });

    const where: any = {};
    if (filtros.dataInicio && filtros.dataFim) {
      where.data = { gte: new Date(filtros.dataInicio), lte: new Date(filtros.dataFim) };
    }
    if (filtros.colaboradorId) where.userId = filtros.colaboradorId;
    if (filtros.projetoId) where.projetoId = filtros.projetoId;

    // Buscar batidas e lançamentos
    const batidas = await this.prisma.batidaPonto.findMany({
      where: {
        userId: filtros.colaboradorId || undefined,
        data: filtros.dataInicio && filtros.dataFim
          ? { gte: new Date(filtros.dataInicio), lte: new Date(filtros.dataFim) }
          : undefined,
      },
      include: { user: true, projeto: true },
    });

    const lancamentos = await this.prisma.lancamentoHora.findMany({
      where,
      include: { user: true, projeto: true },
    });

    // Agrupar por usuário/data
    const agrupado = {} as Record<string, any>;

    for (const bat of batidas) {
      const key = `${bat.userId}-${bat.data.toISOString().slice(0, 10)}`;
      if (!agrupado[key]) {
        agrupado[key] = {
          user: bat.user,
          data: bat.data.toISOString().slice(0, 10),
          horasEsperadas: 8, // TODO: Calcular com base na jornada
          horasRegistradas: 0,
          diferenca: 0,
          batidas: [],
          batidasAusentes: 0,
          lancamentosManuais: 0,
          lembretesEnviados: 0,
        };
      }
      agrupado[key].batidas.push(bat.tipo);
    }

    // Verificar completude das batidas (4 batidas = ENTRADA, SAIDA_ALMOCO, VOLTA_ALMOCO, SAIDA)
    for (const key in agrupado) {
      const batidasEsperadas = ['ENTRADA', 'SAIDA_ALMOCO', 'VOLTA_ALMOCO', 'SAIDA'];
      const temBatidas = batidasEsperadas.filter((tipo) =>
        agrupado[key].batidas.includes(tipo),
      );
      agrupado[key].batidasAusentes = 4 - temBatidas.length;
    }

    // Adicionar lançamentos manuais
    for (const lanc of lancamentos.filter((l) => l.motivoEdicao)) {
      const key = `${lanc.userId}-${lanc.data.toISOString().slice(0, 10)}`;
      if (agrupado[key]) agrupado[key].lancamentosManuais++;
    }

    return Object.values(agrupado);
  }

  async relatorioRentabilidade(filtros: FiltrosRelatorioDto) {
    this.logger.debug('RelatoriosService - Gerando relatório de rentabilidade', { filtros });

    const where: any = {};
    if (filtros.projetoId) where.projetoId = filtros.projetoId;
    if (filtros.dataInicio && filtros.dataFim) {
      where.data = { gte: new Date(filtros.dataInicio), lte: new Date(filtros.dataFim) };
    }

    const projetos = await this.prisma.projeto.findMany({
      where: filtros.projetoId ? { id: filtros.projetoId } : undefined,
      include: {
        lancamentosHora: {
          where: filtros.dataInicio && filtros.dataFim
            ? { data: { gte: new Date(filtros.dataInicio), lte: new Date(filtros.dataFim) } }
            : undefined,
          include: {
            perfilDeCustoSnapshot: true,
            tarefa: true,
          },
        },
        estimativas: { include: { perfilDeCusto: true } },
        contratos: { include: { perfilDeCusto: true } },
        parcelas: true,
      },
    });

    const resultados = await Promise.all(
      projetos.map(async (proj) => {
        // Para Escopo Fechado
        if (proj.billingModel === 'ESCOPO_FECHADO') {
          const estimativas = proj.estimativas.reduce(
            (acc, est) => acc + Number(est.horasEstimadas),
            0,
          );
          const realizadasMes = proj.lancamentosHora.reduce(
            (acc, lanc) => acc + Number(lanc.horas ?? 0),
            0,
          );
          // TODO: Calcular acumulado e saldo
          const receita = Number(proj.feeValor ?? 0);
          const custo = proj.lancamentosHora.reduce(
            (acc, lanc) =>
              acc + Number(lanc.horas ?? 0) * Number(lanc.custoHoraSnapshot ?? 0),
            0,
          );
          const margem = receita - custo;

          return {
            projeto: proj,
            tipo: 'ESCOPO_FECHADO',
            estimadas: estimativas,
            realizadasMes,
            acumuladas: 0, // TODO
            saldo: 0, // TODO
            horasExtrasForaHorario: 0, // TODO
            custo,
            receita,
            margem,
          };
        }

        // Para Alocação
        if (proj.billingModel === 'ALOCACAO') {
          const contratadas = proj.contratos.reduce(
            (acc, c) => acc + Number(c.horasContratadasMes),
            0,
          );
          const usadas = proj.lancamentosHora.reduce((acc, lanc) => acc + Number(lanc.horas ?? 0), 0);
          const excedentes = Math.max(0, usadas - contratadas);
          const custo = proj.lancamentosHora.reduce(
            (acc, lanc) =>
              acc + Number(lanc.horas ?? 0) * Number(lanc.custoHoraSnapshot ?? 0),
            0,
          );
          // TODO: Calcular receita conforme horário/adicional/extra
          const receita = 0; // TODO
          const margem = receita - custo;

          return {
            projeto: proj,
            tipo: 'ALOCACAO',
            contratadas,
            normais: Math.min(usadas, contratadas),
            adicionais: excedentes,
            extras: 0, // TODO
            custo,
            receita,
            margem,
          };
        }

        return null;
      }),
    );

    return resultados.filter(Boolean);
  }

  async relatorioCapacidadeAlocacao(filtros: FiltrosRelatorioDto) {
    this.logger.debug('RelatoriosService - Gerando relatório de capacidade e alocação', { filtros });

    // Buscar usuários (se filtro por gestor, filtrar projetos gerenciados)
    const users = await this.prisma.user.findMany({
      where: filtros.gestorId
        ? {
            projetosGerenciados: {
              some: { gestorId: filtros.gestorId },
            },
          }
        : undefined,
      include: {
        perfilDeCusto: true,
        lancamentosHora: filtros.dataInicio && filtros.dataFim
          ? {
              where: {
                data: { gte: new Date(filtros.dataInicio), lte: new Date(filtros.dataFim) },
              },
            }
          : undefined,
        alocacoes: {
          include: { projeto: true, tarefa: true },
        },
      },
    });

    const resultados = await Promise.all(
      users.map(async (user) => {
        const capacidade = user.cargaSemanalHoras * 4.33; // Média mensal
        const alocado = user.alocacoes.reduce((acc, aloc) => {
          const diasMes = 30; // TODO: Calcular dias úteis do mês
          return acc + (user.cargaSemanalHoras / 5) * diasMes; // Simplificado
        }, 0);
        const cargaReal = user.lancamentosHora.reduce((acc, lanc) => acc + Number(lanc.horas ?? 0), 0);

        return {
          user,
          capacidade,
          alocado,
          cargaReal,
          diferenca: capacidade - alocado,
          percentualUtilizacao: (cargaReal / capacidade) * 100,
          distribuicaoPorProjeto: user.alocacoes.map((aloc) => ({
            projeto: aloc.projeto,
            tarefa: aloc.tarefa,
            horas: 0, // TODO: Agregar por projeto
          })),
        };
      }),
    );

    return resultados;
  }
}



