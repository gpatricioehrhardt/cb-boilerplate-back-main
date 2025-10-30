import { Injectable } from '@nestjs/common';
import pino from 'pino';
import { Context } from '../context/context.service';

@Injectable()
export class LoggerService {
  constructor(private readonly context: Context) {}
  private readonly logger = pino({
    level: process.env.LOG_LEVEL || 'info',
    transport:
      process.env.NODE_ENV === 'development'
        ? {
            target: 'pino-pretty',
            options: {
              colorize: true,
              translateTime: 'SYS:standard',
              ignore: 'pid,hostname',
            },
          }
        : undefined,
    timestamp: pino.stdTimeFunctions.isoTime,
    formatters: {
      level(label: string) {
        return { level: label };
      },
    },
    messageKey: 'message',
  });

  info(message: string, additionalFields?: Record<string, unknown>) {
    this.logger.info({ ...this.context.getAll(), ...additionalFields }, message);
  }

  error(message: string, additionalFields?: Record<string, unknown>) {
    this.logger.error({ ...this.context.getAll(), ...additionalFields }, message);
  }

  warn(message: string, additionalFields?: Record<string, unknown>) {
    this.logger.warn({ ...this.context.getAll(), ...additionalFields }, message);
  }

  debug(message: string, additionalFields?: Record<string, unknown>) {
    this.logger.debug({ ...this.context.getAll(), ...additionalFields }, message);
  }

  verbose(message: string, additionalFields?: Record<string, unknown>) {
    this.logger.trace({ ...this.context.getAll(), ...additionalFields }, message);
  }
}
