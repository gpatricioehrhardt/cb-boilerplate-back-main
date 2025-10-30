import { IsNotEmpty, IsString, IsOptional, IsEnum, IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { BillingModel, FeeTipo, ProjetoStatus } from '../model/projeto.model';

export class UpdateProjetoDto {
  @ApiProperty({ example: 'Sistema de Vendas', required: false })
  @IsString()
  @IsOptional()
  nome?: string;

  @ApiProperty({ example: 'Empresa ABC Ltda', required: false })
  @IsString()
  @IsOptional()
  cliente?: string;

  @ApiProperty({ example: 'CC001', required: false })
  @IsString()
  @IsOptional()
  centroCusto?: string;

  @ApiProperty({ example: 'ATIVO', enum: ProjetoStatus, required: false })
  @IsEnum(ProjetoStatus)
  @IsOptional()
  status?: ProjetoStatus;

  @ApiProperty({ example: 'ESCOPO_FECHADO', enum: BillingModel, required: false })
  @IsEnum(BillingModel)
  @IsOptional()
  billingModel?: BillingModel;

  @ApiProperty({ example: 'FIXO', enum: FeeTipo, required: false })
  @IsEnum(FeeTipo)
  @IsOptional()
  feeTipo?: FeeTipo;

  @ApiProperty({ example: 50000.00, required: false })
  @IsNumber()
  @Min(0)
  @IsOptional()
  feeValor?: number;

  @ApiProperty({ example: 1, required: false })
  @IsNumber()
  @IsOptional()
  gestorId?: number;
}



