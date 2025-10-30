import { IsNotEmpty, IsString, IsOptional, IsNumber, IsBoolean, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTarefaDto {
  @ApiProperty({ example: 1 })
  @IsNumber()
  projetoId: number;

  @ApiProperty({ example: 'Desenvolvimento da API' })
  @IsString()
  @IsNotEmpty()
  nome: string;

  @ApiProperty({ example: 40.00, required: false })
  @IsNumber()
  @Min(0)
  @IsOptional()
  orcamentoHoras?: number;

  @ApiProperty({ example: true })
  @IsBoolean()
  @IsOptional()
  ativo?: boolean = true;
}



