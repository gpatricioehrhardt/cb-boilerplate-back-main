import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumber, IsInt } from 'class-validator';

export class FiltrosRelatorioDto {
  @ApiProperty({ example: '2025-01-01', required: false })
  @IsString()
  @IsOptional()
  dataInicio?: string;

  @ApiProperty({ example: '2025-01-31', required: false })
  @IsString()
  @IsOptional()
  dataFim?: string;

  @ApiProperty({ example: 1, required: false })
  @IsInt()
  @IsOptional()
  projetoId?: number;

  @ApiProperty({ example: 1, required: false })
  @IsInt()
  @IsOptional()
  colaboradorId?: number;

  @ApiProperty({ example: 1, required: false })
  @IsInt()
  @IsOptional()
  perfilId?: number;

  @ApiProperty({ example: 1, required: false })
  @IsInt()
  @IsOptional()
  gestorId?: number;
}



