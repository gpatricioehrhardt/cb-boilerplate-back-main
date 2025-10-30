import {
  Body,
  Controller,
  InternalServerErrorException,
  Post,
  Get,
  Delete,
  UnauthorizedException,
  BadRequestException,
  Res,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoggerService } from '../common/logger/logger.service';
import { ResponseStatus } from '../common/model/response.model';
import { AuthService } from './auth.service';
import { AuthDto, AuthResponseDto } from './dto/auth.dto';
import { LogoutResponseDto } from './dto/logout.dto';
import { RefreshTokenDto, RefreshTokenResponseDto } from './dto/refresh.token.dto';
import { Response } from 'express';
import { Roles } from '../common/decorator/roles.decorator';
import { JwtAuthGuard } from '../common/jwt/jwt.auth.guard';
import { Context } from '../common/context/context.service';
import { ValidateTokenDto } from './dto/validate.token.dto';
import { I18nService } from 'nestjs-i18n';
import { HttpStatusEnum } from '../common/helper/enums/enum.httpStatus';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly logger: LoggerService,
    private readonly context: Context,
    private readonly i18n: I18nService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Auth user' })
  @ApiResponse({ ...ResponseStatus.OK, isArray: false, type: AuthResponseDto })
  @ApiResponse({ ...ResponseStatus.UNAUTHORIZED })
  @ApiResponse({ ...ResponseStatus.INTERNAL_SERVER_ERROR })
  @ApiResponse({ ...ResponseStatus.NOT_FOUND })
  @ApiBody({
    type: AuthDto,
    description: 'user credentials',
  })
  async auth(
    @Body() dto: AuthDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<AuthResponseDto> {
    try {
      const username = dto.username;
      this.context.set('username', username);

      this.logger.debug('AuthController - Authenticating user');

      const userData = await this.authService.login(dto);

      if (!userData) {
        this.logger.warn('AuthController - Invalid credentials.', { username });
        throw new UnauthorizedException(this.i18n.translate('auth.login.invalid_credentials'));
      }

      this.logger.debug('AuthController -  User authenticated successfully', {
        responseBody: userData,
      });

      //Creating session cookie
      res.cookie('authToken', userData.token, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        maxAge: 60 * 60 * 1000,
      });

      const authResponseDto: AuthResponseDto = {
        ...userData,
      };

      return authResponseDto;
    } catch (error) {
      this.handleError(error, 'auth.login.internal_server_error', dto);
    }
  }

  /**
   * Logout user and release all container locks held by them.
   */
  @Delete('logout')
  @UseGuards(JwtAuthGuard)
  @Roles('ADMINISTRATOR')
  @ApiOperation({ summary: 'Logout user' })
  @ApiResponse({ ...ResponseStatus.OK, isArray: false, type: LogoutResponseDto })
  @ApiResponse({ ...ResponseStatus.UNAUTHORIZED })
  @ApiResponse({ ...ResponseStatus.INTERNAL_SERVER_ERROR })
  logout(@Request() req, @Res({ passthrough: true }) res: Response): LogoutResponseDto {
    try {
      // Cleaning the session cookie
      res.clearCookie('authToken', {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
      });

      this.logger.debug('AuthController - User logged out');
      return {
        logout: true,
        message: '',
      };
    } catch (error) {
      this.handleError(error, 'auth.logout.internal_server_error', null);
    }
  }

  @Get('validate')
  @UseGuards(JwtAuthGuard)
  @Roles('ADMINISTRATOR')
  @ApiOperation({ summary: 'Validate the user token' })
  @ApiResponse({ ...ResponseStatus.OK, isArray: false, type: ValidateTokenDto })
  @ApiResponse({ ...ResponseStatus.UNAUTHORIZED })
  @ApiResponse({ ...ResponseStatus.INTERNAL_SERVER_ERROR })
  async validate(
    @Request() req,
    @Res({ passthrough: true }) res: Response,
  ): Promise<ValidateTokenDto> {
    try {
      //Getting the token from the request
      const authHeader = req.headers['authorization'];
      const bearerToken = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;
      const authToken = req.cookies?.authToken || bearerToken;

      this.context.set('authToken', authToken);

      if (!authToken) {
        throw new BadRequestException(this.i18n.translate('auth.validateToken.invalid_session'));
      }

      this.logger.debug('AuthController - Validating user token');

      //Validate the token
      const user = await this.authService.validateToken(authToken);

      this.context.set('username', user.username);

      this.logger.debug('AuthController - User token validated successfully');
      return { isValid: true, user: user };
    } catch (error) {
      //Clean the token
      res.clearCookie('authToken', {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
      });

      this.handleError(error, 'auth.validateToken.internal_server_error', null);
    }
  }

  @Post('refresh')
  @Roles('ADMINISTRATOR')
  @ApiOperation({ summary: 'Refresh the user token' })
  @ApiResponse({ ...ResponseStatus.OK, isArray: false, type: RefreshTokenResponseDto })
  @ApiResponse({ ...ResponseStatus.UNAUTHORIZED })
  @ApiResponse({ ...ResponseStatus.INTERNAL_SERVER_ERROR })
  refresh(@Body() dto: RefreshTokenDto): RefreshTokenResponseDto {
    try {
      const refreshToken = dto.refreshToken;

      if (!refreshToken) {
        throw new UnauthorizedException(
          this.i18n.translate('auth.refreshToken.refresh_token_required'),
        );
      }

      this.context.set('refreshToken', refreshToken);

      this.logger.debug('AuthController - Refreshing user token');
      const newAccessToken = this.authService.refreshToken(dto.refreshToken);

      return newAccessToken;
    } catch (error) {
      this.handleError(error, 'auth.refreshToken.internal_server_error', null);
    }
  }

  /**
   * Handles and logs errors in a standardized way, ensuring consistent exception management across the code.
   * This method centralizes error handling logic by:
   * - Logging the localized error message along with relevant contextual details (error message, stack trace, and parameters).
   * - Translating the provided internationalization (i18n) message key for improved readability in logs and thrown exceptions.
   * - Re-throwing an `InternalServerErrorException` if the captured error represents a server-side failure,
   *   or re-throwing the original error otherwise.
   *
   * @param {any} error - The caught error object, which may originate from an HTTP request, service failure, or internal operation.
   * @param {string} i18nMessageKey - The i18n key representing the localized error message to log and include in the exception.
   * @param {any} param - Additional contextual parameter or payload relevant to the error (used for detailed logging).
   *
   * @throws {InternalServerErrorException} When the error status equals `HttpStatusEnum.INTERNAL_SERVER_ERROR`.
   * @throws {Error} Re-throws the original error if it is not an internal server error.
   *
   * */
  private handleError(error: any, i18nMessageKey: string, param: any): never {
    this.logger.error(this.i18n.translate(i18nMessageKey, { lang: 'en' }), {
      error: error?.message,
      stack: error?.stack,
      param: param,
    });

    if (error.getStatus() == HttpStatusEnum.INTERNAL_SERVER_ERROR) {
      throw new InternalServerErrorException(this.i18n.translate(i18nMessageKey));
    } else {
      throw error;
    }
  }
}
