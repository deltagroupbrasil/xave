import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { LoggerService } from '../common/services/logger.service';

@Injectable()
export class DatabaseService extends PrismaClient implements OnModuleInit {
  constructor(private readonly logger: LoggerService) {
    super({
      log: ['query', 'info', 'warn', 'error'],
    });
  }

  async onModuleInit() {
    await this.$connect();
    this.logger.log('Database connected successfully', 'DatabaseService');
  }

  async onModuleDestroy() {
    await this.$disconnect();
    this.logger.log('Database disconnected', 'DatabaseService');
  }
}
