import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export enum TipoBatidaDto {
  ENTRADA = 'ENTRADA',
  SAIDA_ALMOCO = 'SAIDA_ALMOCO',
  VOLTA_ALMOCO = 'VOLTA_ALMOCO',
  SAIDA = 'SAIDA',
}

export class BaterPontoDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  userId: number;

  @ApiProperty({ example: '2025-10-28' })
  @IsDateString()
  data: string; // ISO date (yyyy-mm-dd)

  @ApiProperty({ example: 'ENTRADA', enum: TipoBatidaDto })
  @IsEnum(TipoBatidaDto)
  tipo: TipoBatidaDto;

  @ApiProperty({ example: 10, required: false, description: 'Projeto ativo no momento da batida (modo por alocação)' })
  @IsInt()
  @IsOptional()
  projetoId?: number;

  @ApiProperty({ example: 'Esqueci de bater no horário', required: false })
  @IsString()
  @IsOptional()
  observacao?: string;
}



