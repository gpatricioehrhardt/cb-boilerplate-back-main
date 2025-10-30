import { IsEmail, IsNotEmpty, IsString, IsOptional, IsEnum, IsNumber, IsBoolean, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserPerfil } from './create-user.dto';

export class UpdateUserDto {
  @ApiProperty({ example: 'João Silva', required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ example: 'joao.silva@empresa.com', required: false })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({ example: 'senha123', required: false })
  @IsString()
  @IsOptional()
  password?: string;

  @ApiProperty({ example: 'COLABORADOR', enum: UserPerfil, required: false })
  @IsEnum(UserPerfil)
  @IsOptional()
  perfil?: UserPerfil;

  @ApiProperty({ example: 1, required: false })
  @IsNumber()
  @IsOptional()
  perfilDeCustoId?: number;

  @ApiProperty({ example: 50.00, required: false })
  @IsNumber()
  @IsOptional()
  custoHora?: number;

  @ApiProperty({ example: 40, required: false })
  @IsNumber()
  @Min(1)
  @Max(60)
  @IsOptional()
  cargaSemanalHoras?: number;

  @ApiProperty({ example: true, required: false })
  @IsBoolean()
  @IsOptional()
  ativo?: boolean;
}



