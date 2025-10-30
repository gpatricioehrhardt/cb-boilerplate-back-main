import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  ForbiddenException,
  Inject,
} from '@nestjs/common';
import { LoggerService } from '../logger/logger.service';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorator/roles.decorator';
import { I18nService } from 'nestjs-i18n';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly logger: LoggerService,
    @Inject('JWT_AUTH_SERVICE') private readonly jwtAuthService: JwtService,
    private reflector: Reflector,
    private readonly i18nService: I18nService
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'];

    if (!authHeader) {
      throw new UnauthorizedException(this.i18nService.translate('auth.jwtGuard.authorization_header_missing'));
    }

    const [type, token] = authHeader.split(' ');

    if (type !== 'Bearer' || !token) {
      throw new UnauthorizedException(this.i18nService.translate('auth.jwtGuard.invalid_authorization_format'));
    }

    try {
      const decoded = this.jwtAuthService.verify(token);
      if (!decoded) {
        throw new UnauthorizedException(this.i18nService.translate('auth.jwtGuard.invalid_token'));
      }
      request.user = decoded;

      if (!decoded || !decoded.role) {
        throw new ForbiddenException(this.i18nService.translate('auth.jwtGuard.role_not_found'));
      }

      const hasRole = requiredRoles ? requiredRoles.includes(decoded.role) : true;
      if (!hasRole) {
        throw new ForbiddenException(this.i18nService.translate('auth.jwtGuard.insufficient_permissions'));
      }

      return true;
    } catch (error) {
      this.logger.error('JWTAuthGuard: Error verifying token', {
        error: error.message,
        stack: error.stack,
      });

      if (error.name == 'ForbiddenException') {
        throw new ForbiddenException(this.i18nService.translate('auth.jwtGuard.insufficient_permissions'));
      }

      throw new UnauthorizedException(this.i18nService.translate('auth.jwtGuard.invalid_or_expired_token'), { cause: error });
    }
  }
}
