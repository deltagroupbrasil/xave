import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { ScheduleModule } from '@nestjs/schedule';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { BullModule } from '@nestjs/bull';

// Core modules
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { CharactersModule } from './characters/characters.module';
import { InteractionsModule } from './interactions/interactions.module';
import { GamificationModule } from './gamification/gamification.module';
import { MissionsModule } from './missions/missions.module';
import { FashionModule } from './fashion/fashion.module';
import { PaymentsModule } from './payments/payments.module';
import { WhatsappModule } from './whatsapp/whatsapp.module';

// AI and external services
import { AiOrchestratorModule } from './ai-orchestrator/ai-orchestrator.module';
import { StorageModule } from './storage/storage.module';
import { NotificationsModule } from './notifications/notifications.module';

// Configuration
import configuration from './config/configuration';

// Common services
import { CommonModule } from './common/common.module';

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),

    // Rate limiting
    ThrottlerModule.forRoot([
      {
        name: 'short',
        ttl: 1000,
        limit: 3,
      },
      {
        name: 'medium',
        ttl: 10000,
        limit: 20,
      },
      {
        name: 'long',
        ttl: 60000,
        limit: 100,
      },
    ]),

    // Task scheduling
    ScheduleModule.forRoot(),

    // Event system
    EventEmitterModule.forRoot(),

    // Queue system
    BullModule.forRoot({
      redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT) || 6379,
        password: process.env.REDIS_PASSWORD,
      },
    }),

    // Core modules
    CommonModule,
    DatabaseModule,
    StorageModule,
    
    // Authentication & Users
    AuthModule,
    UsersModule,
    CharactersModule,

    // AI & Interactions
    AiOrchestratorModule,
    InteractionsModule,

    // Gamification
    GamificationModule,
    MissionsModule,

    // Features
    FashionModule,
    PaymentsModule,
    WhatsappModule,
    NotificationsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
