import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { Context } from '../context/context.service';
import { LoggerService } from '../logger/logger.service';

@Injectable()
export class HttpContextMiddleware implements NestMiddleware {
  constructor(
    private readonly context: Context,
    private readonly logger: LoggerService,
  ) {}

  use(req: Request, res: Response, next: NextFunction): void {
    const requestId = Array.isArray(req.headers['x-request-id'])
      ? req.headers['x-request-id'][0]
      : req.headers['x-request-id'] || Date.now().toString();

    this.context.run({ requestId }, () => {
      this.logger.debug('Request received');
      next();
    });
  }
}
