import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { InteractionsController } from './interactions.controller';
import { InteractionsService } from './interactions.service';

@Module({
  imports: [
    MulterModule.register({
      limits: {
        fileSize: 10 * 1024 * 1024, // 10MB
      },
    }),
  ],
  controllers: [InteractionsController],
  providers: [InteractionsService],
  exports: [InteractionsService],
})
export class InteractionsModule {}
