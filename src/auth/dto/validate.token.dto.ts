import { IsBoolean, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserAuth } from '../model/user-auth.model';

export class ValidateTokenDto {
  @ApiProperty({ example: true })
  @IsBoolean()
  @IsNotEmpty()
  isValid: boolean;

  @ApiProperty({ type: () => UserAuth, description: 'Authenticated user details' })
  @IsNotEmpty()
  user: UserAuth;
}
