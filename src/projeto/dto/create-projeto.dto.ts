import { IsNotEmpty, IsString, IsOptional, IsEnum, IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { BillingModel, FeeTipo } from '../model/projeto.model';

export class CreateProjetoDto {
  @ApiProperty({ example: 'Sistema de Vendas' })
  @IsString()
  @IsNotEmpty()
  nome: string;

  @ApiProperty({ example: 'Empresa ABC Ltda', required: false })
  @IsString()
  @IsOptional()
  cliente?: string;

  @ApiProperty({ example: 'CC001', required: false })
  @IsString()
  @IsOptional()
  centroCusto?: string;

  @ApiProperty({ example: 'ESCOPO_FECHADO', enum: BillingModel })
  @IsEnum(BillingModel)
  billingModel: BillingModel;

  @ApiProperty({ example: 'FIXO', enum: FeeTipo, required: false })
  @IsEnum(FeeTipo)
  @IsOptional()
  feeTipo?: FeeTipo;

  @ApiProperty({ example: 50000.00, required: false })
  @IsNumber()
  @Min(0)
  @IsOptional()
  feeValor?: number;

  @ApiProperty({ example: 1 })
  @IsNumber()
  gestorId: number;
}



