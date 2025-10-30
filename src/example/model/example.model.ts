import { Expose } from 'class-transformer';

export class Example {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  createdAt: Date;
}
