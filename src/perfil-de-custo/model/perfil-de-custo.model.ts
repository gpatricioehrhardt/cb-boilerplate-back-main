import { Expose } from 'class-transformer';

export class PerfilDeCusto {
  @Expose()
  id: number;

  @Expose()
  nome: string;

  @Expose()
  custoHora: number;

  @Expose()
  ativo: boolean;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}



