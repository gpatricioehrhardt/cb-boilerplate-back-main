import { IsNotEmpty, IsString, IsNumber, IsBoolean, IsOptional, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePerfilDeCustoDto {
  @ApiProperty({ example: 'Desenvolvedor Júnior' })
  @IsString()
  @IsNotEmpty()
  nome: string;

  @ApiProperty({ example: 50.00 })
  @IsNumber()
  @Min(0)
  custoHora: number;

  @ApiProperty({ example: true })
  @IsBoolean()
  @IsOptional()
  ativo?: boolean = true;
}



