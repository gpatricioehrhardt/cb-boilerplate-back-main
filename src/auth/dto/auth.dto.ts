import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AuthDto {
  @ApiProperty({ example: 'user.name' })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({ example: 'password123' })
  @IsString()
  @IsNotEmpty()
  password: string;
}

export class AuthResponseDto {
  @ApiProperty({ example: 10 })
  @IsString()
  @IsNotEmpty()
  id: number;

  @ApiProperty({ example: 'newUser' })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({ example: 'John Doe' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'Supervisor' })
  @IsString()
  @IsNotEmpty()
  role: string;

  @ApiProperty({ example: 'token' })
  @IsString()
  @IsNotEmpty()
  token?: string;

  @ApiProperty({ example: 'refreshToken' })
  @IsString()
  @IsNotEmpty()
  refreshToken?: string;

  @ApiProperty({ example: 'pt' })
  @IsString()
  @IsNotEmpty()
  locale: string;
}
