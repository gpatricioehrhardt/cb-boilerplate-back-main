import { Expose } from 'class-transformer';

export class Tarefa {
  @Expose()
  id: number;

  @Expose()
  projetoId: number;

  @Expose()
  nome: string;

  @Expose()
  orcamentoHoras?: number;

  @Expose()
  ativo: boolean;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}



