import { IsEmail, IsNotEmpty, IsString, IsOptional, IsEnum, IsNumber, IsBoolean, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum UserPerfil {
  ADMIN = 'ADMIN',
  GESTOR = 'GESTOR',
  COLABORADOR = 'COLABORADOR'
}

export class CreateUserDto {
  @ApiProperty({ example: 'João Silva' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'joao.silva@empresa.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'senha123' })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({ example: 'COLABORADOR', enum: UserPerfil })
  @IsEnum(UserPerfil)
  @IsOptional()
  perfil?: UserPerfil = UserPerfil.COLABORADOR;

  @ApiProperty({ example: 1, required: false })
  @IsNumber()
  @IsOptional()
  perfilDeCustoId?: number;

  @ApiProperty({ example: 50.00, required: false })
  @IsNumber()
  @IsOptional()
  custoHora?: number;

  @ApiProperty({ example: 40 })
  @IsNumber()
  @Min(1)
  @Max(60)
  @IsOptional()
  cargaSemanalHoras?: number = 40;

  @ApiProperty({ example: true })
  @IsBoolean()
  @IsOptional()
  ativo?: boolean = true;
}



