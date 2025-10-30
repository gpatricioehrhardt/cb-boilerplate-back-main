import { Expose } from 'class-transformer';

export class User {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  email: string;

  @Expose()
  perfil: string;

  @Expose()
  perfilDeCustoId?: number;

  @Expose()
  custoHora?: number;

  @Expose()
  cargaSemanalHoras: number;

  @Expose()
  ativo: boolean;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}

