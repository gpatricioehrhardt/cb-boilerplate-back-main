import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsDateString, IsEnum, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';

export enum ModoRegistroDto {
  TIMESHEET = 'TIMESHEET',
  PONTO = 'PONTO',
}

export enum ClassificacaoColaboradorDto {
  NORMAL = 'NORMAL',
  EXTRA = 'EXTRA',
  BANCO = 'BANCO',
}

export enum ClassificacaoProjetoDto {
  NORMAL = 'NORMAL',
  EXTRA = 'EXTRA',
}

export class LancarTimesheetDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  userId: number;

  @ApiProperty({ example: 10 })
  @IsInt()
  projetoId: number;

  @ApiProperty({ example: 100, required: false })
  @IsInt()
  @IsOptional()
  tarefaId?: number;

  @ApiProperty({ example: '2025-10-28' })
  @IsDateString()
  data: string; // ISO date (yyyy-mm-dd)

  @ApiProperty({ example: '09:00', required: false })
  @IsString()
  @IsOptional()
  inicio?: string; // HH:mm

  @ApiProperty({ example: '18:00', required: false })
  @IsString()
  @IsOptional()
  fim?: string; // HH:mm

  @ApiProperty({ example: 8, required: false, description: 'Horas totais; se informado, ignora início/fim' })
  @IsNumber()
  @Min(0)
  @Max(24)
  @IsOptional()
  horas?: number;

  @ApiProperty({ example: 'TIMESHEET', enum: ModoRegistroDto })
  @IsEnum(ModoRegistroDto)
  modoRegistro: ModoRegistroDto = ModoRegistroDto.TIMESHEET;

  @ApiProperty({ example: 'EXTRA', enum: ClassificacaoColaboradorDto, required: false })
  @IsEnum(ClassificacaoColaboradorDto)
  @IsOptional()
  classificacaoColaborador?: ClassificacaoColaboradorDto;

  @ApiProperty({ example: 'NORMAL', enum: ClassificacaoProjetoDto, required: false })
  @IsEnum(ClassificacaoProjetoDto)
  @IsOptional()
  classificacaoProjeto?: ClassificacaoProjetoDto;

  @ApiProperty({ example: false, required: false })
  @IsBoolean()
  @IsOptional()
  ehForaHorario?: boolean;

  @ApiProperty({ example: 'Ajuste por esquecimento', required: false })
  @IsString()
  @IsOptional()
  motivoEdicao?: string;
}



