import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import * as compression from 'compression';
import { AppModule } from './app.module';
import { LoggerService } from './common/services/logger.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new LoggerService(),
  });

  const configService = app.get(ConfigService);
  const port = configService.get('PORT', 3000);
  const nodeEnv = configService.get('NODE_ENV', 'development');

  // Security middlewares
  app.use(helmet());
  app.use(compression());

  // CORS configuration
  app.enableCors({
    origin: configService.get('CORS_ORIGINS', 'http://localhost:3000').split(','),
    credentials: true,
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Global prefix
  app.setGlobalPrefix('api/v1');

  // Swagger documentation (only in development)
  if (nodeEnv === 'development' && configService.get('ENABLE_SWAGGER', true)) {
    const config = new DocumentBuilder()
      .setTitle('Flerte Gamificado API')
      .setDescription('API para o app mobile de ensino gamificado de flerte')
      .setVersion('1.0')
      .addBearerAuth()
      .addTag('auth', 'Autenticação e autorização')
      .addTag('users', 'Gerenciamento de usuários')
      .addTag('characters', 'Configuração de avatares')
      .addTag('interactions', 'Interações com IA')
      .addTag('gamification', 'Sistema de gamificação')
      .addTag('missions', 'Missões e desafios')
      .addTag('fashion', 'Módulo de moda')
      .addTag('payments', 'Pagamentos e assinaturas')
      .addTag('whatsapp', 'Bot do WhatsApp')
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document, {
      swaggerOptions: {
        persistAuthorization: true,
      },
    });
  }

  await app.listen(port);

  console.log(`
🚀 Flerte Gamificado API está rodando!
📍 URL: http://localhost:${port}
📚 Docs: http://localhost:${port}/api/docs
🌍 Ambiente: ${nodeEnv}
  `);
}

bootstrap().catch((error) => {
  console.error('❌ Erro ao inicializar a aplicação:', error);
  process.exit(1);
});
