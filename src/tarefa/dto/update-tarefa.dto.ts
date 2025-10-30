import { IsNotEmpty, IsString, IsOptional, IsNumber, IsBoolean, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateTarefaDto {
  @ApiProperty({ example: 'Desenvolvimento da API', required: false })
  @IsString()
  @IsOptional()
  nome?: string;

  @ApiProperty({ example: 40.00, required: false })
  @IsNumber()
  @Min(0)
  @IsOptional()
  orcamentoHoras?: number;

  @ApiProperty({ example: true, required: false })
  @IsBoolean()
  @IsOptional()
  ativo?: boolean;
}



