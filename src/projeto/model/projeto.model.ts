import { Expose } from 'class-transformer';

export enum ProjetoStatus {
  ATIVO = 'ATIVO',
  PAUSADO = 'PAUSADO',
  CONCLUIDO = 'CONCLUIDO',
  CANCELADO = 'CANCELADO'
}

export enum BillingModel {
  ESCOPO_FECHADO = 'ESCOPO_FECHADO',
  ALOCACAO = 'ALOCACAO'
}

export enum FeeTipo {
  FIXO = 'FIXO',
  POR_HORA = 'POR_HORA'
}

export class Projeto {
  @Expose()
  id: number;

  @Expose()
  nome: string;

  @Expose()
  cliente?: string;

  @Expose()
  centroCusto?: string;

  @Expose()
  status: ProjetoStatus;

  @Expose()
  billingModel: BillingModel;

  @Expose()
  feeTipo?: FeeTipo;

  @Expose()
  feeValor?: number;

  @Expose()
  gestorId: number;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}



