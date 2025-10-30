import { Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Exclude, Expose } from 'class-transformer';

export class UserAuth {
  constructor(
    partialAuth: Partial<UserAuth>,
    @Inject('JWT_AUTH_SERVICE') jwtAuthService?: JwtService,
    @Inject('JWT_REFRESH_SERVICE') jwtRefreshService?: JwtService,
  ) {
    Object.assign(this, partialAuth); //Setting the attributes

    //Creating the user token
    if (jwtAuthService && jwtRefreshService) {
      this.token = jwtAuthService.sign({
        id: this.id,
        username: this.username,
        role: this.role,
      });

      //Creating the refresh token
      this.refreshToken = jwtRefreshService.sign({
        id: this.id,
        username: this.username,
        role: this.role,
      });
    }
  }

  id: number;
  name: string;
  username: string;
  role: string;
  locale: string;

  @Expose()
  token: string;
  @Expose()
  refreshToken: string;

  @Exclude()
  private jwtAuthService?: JwtService;

  @Exclude()
  private jwtRefreshService?: JwtService;
}
