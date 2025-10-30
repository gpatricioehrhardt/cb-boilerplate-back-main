import { IsNotEmpty, IsString, IsNumber, IsBoolean, IsOptional, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdatePerfilDeCustoDto {
  @ApiProperty({ example: 'Desenvolvedor Júnior', required: false })
  @IsString()
  @IsOptional()
  nome?: string;

  @ApiProperty({ example: 50.00, required: false })
  @IsNumber()
  @Min(0)
  @IsOptional()
  custoHora?: number;

  @ApiProperty({ example: true, required: false })
  @IsBoolean()
  @IsOptional()
  ativo?: boolean;
}



