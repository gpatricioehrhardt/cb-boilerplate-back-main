import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LogoutResponseDto {
  @ApiProperty({ example: true })
  @IsBoolean()
  @IsNotEmpty()
  logout: boolean;

  @ApiProperty({ example: 'User Logged Out' })
  @IsString()
  @IsNotEmpty()
  message: string;
}
