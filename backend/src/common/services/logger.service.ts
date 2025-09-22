import { Injectable, LoggerService as NestLoggerService } from '@nestjs/common';
import * as winston from 'winston';

@Injectable()
export class LoggerService implements NestLoggerService {
  private logger: winston.Logger;

  constructor() {
    this.logger = winston.createLogger({
      level: process.env.LOG_LEVEL || 'info',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        winston.format.json(),
      ),
      defaultMeta: { service: 'flerte-gamificado-backend' },
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.colorize(),
            winston.format.simple(),
          ),
        }),
      ],
    });

    // Add file transport in production
    if (process.env.NODE_ENV === 'production') {
      this.logger.add(
        new winston.transports.File({
          filename: 'logs/error.log',
          level: 'error',
        }),
      );
      this.logger.add(
        new winston.transports.File({
          filename: 'logs/combined.log',
        }),
      );
    }
  }

  log(message: string, context?: string) {
    this.logger.info(message, { context });
  }

  error(message: string, trace?: string, context?: string) {
    this.logger.error(message, { trace, context });
  }

  warn(message: string, context?: string) {
    this.logger.warn(message, { context });
  }

  debug(message: string, context?: string) {
    this.logger.debug(message, { context });
  }

  verbose(message: string, context?: string) {
    this.logger.verbose(message, { context });
  }

  // Custom methods for structured logging
  logInteraction(userId: string, channel: string, type: string, metadata?: any) {
    this.logger.info('User interaction', {
      userId,
      channel,
      type,
      metadata,
      event: 'interaction',
    });
  }

  logAiRequest(userId: string, model: string, tokens: number, duration: number) {
    this.logger.info('AI request processed', {
      userId,
      model,
      tokens,
      duration,
      event: 'ai_request',
    });
  }

  logPayment(userId: string, amount: number, currency: string, status: string) {
    this.logger.info('Payment processed', {
      userId,
      amount,
      currency,
      status,
      event: 'payment',
    });
  }

  logSecurity(event: string, userId?: string, metadata?: any) {
    this.logger.warn('Security event', {
      event,
      userId,
      metadata,
      type: 'security',
    });
  }
}
