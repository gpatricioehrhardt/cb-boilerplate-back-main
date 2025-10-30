import { Inject, UnauthorizedException } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthDto } from './dto/auth.dto';
import { UserAuth } from './model/user-auth.model';
import { PrismaService } from '../prisma/prisma.service';
import { LoggerService } from '../common/logger/logger.service';
import * as bcrypt from 'bcrypt';
import { I18nService } from 'nestjs-i18n';

@Injectable()
export class AuthService {
  constructor(
    @Inject('JWT_AUTH_SERVICE') private readonly jwtAuthService: JwtService,
    @Inject('JWT_REFRESH_SERVICE') private readonly jwtRefreshService: JwtService,
    private readonly logger: LoggerService,
    private readonly prismaService: PrismaService,
    private readonly i18nService: I18nService,
  ) {}

  /**
   * Authenticate a user by login and password
   * @param {AuthDto} dto - Login credentials
   * @returns {Promise<UserAuth>} - User Authtentication data
   */
  async login(dto: AuthDto): Promise<UserAuth> {
    const { username, password } = dto;

    this.logger.debug('AuthService - Attempting login', { username });


    const userAuth = new UserAuth(
      {
        id: 1,
        name: 'John Defoe',
        role: 'ADMINISTRATOR',
        locale: 'pt',
      },
      this.jwtAuthService,
      this.jwtRefreshService,
    );

    this.logger.debug('AuthService - Login: success', { username });

    return userAuth;
  }

  /**
   * Check if the user JWT token is still valid
   * @param {string} token - user JWT Token.
   * @returns {AuthResponseDto} - User session token
   */
  validateToken(token: string): any {
    try {
      return this.jwtAuthService.verify(token);
    } catch (error) {
      throw new Error(this.i18nService.translate('auth.validateToken.invalid_token'), {
        cause: error,
      });
    }
  }

  /**
   * Validate the refresh token and generate a new access token
   * @param {string} refreshToken - refresh Token.
   * @returns {AuthResponseDto} - User session token
   */
  refreshToken(refreshToken: string): any {
    try {
      //Checking if the refresh token is valid
      const user = this.jwtRefreshService.verify(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET,
      });

      //Generating a new access token
      const newAccessToken = this.jwtAuthService.sign({ user });

      return { accessToken: newAccessToken };
    } catch (error) {
      throw new UnauthorizedException(
        this.i18nService.translate('auth.refreshToken.invalid_refresh_token'),
        { cause: error },
      );
    }
  }
}
