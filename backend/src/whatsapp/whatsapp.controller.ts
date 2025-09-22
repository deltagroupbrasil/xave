import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  Query,
  Headers,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { WhatsappService } from './whatsapp.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { SendMessageDto } from './dto/send-message.dto';
import { LoggerService } from '../common/services/logger.service';

@ApiTags('whatsapp')
@Controller('whatsapp')
export class WhatsappController {
  constructor(
    private readonly whatsappService: WhatsappService,
    private readonly logger: LoggerService,
  ) {}

  @Post('webhook')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Webhook do WhatsApp Business API' })
  @ApiResponse({
    status: 200,
    description: 'Webhook processado com sucesso',
  })
  async handleWebhook(
    @Body() body: any,
    @Headers('x-hub-signature-256') signature: string,
  ) {
    this.logger.log('Received WhatsApp webhook', 'WhatsappController');
    return this.whatsappService.handleWebhook(body, signature);
  }

  @Get('webhook')
  @ApiOperation({ summary: 'Verificação do webhook do WhatsApp' })
  @ApiResponse({
    status: 200,
    description: 'Webhook verificado com sucesso',
  })
  async verifyWebhook(
    @Query('hub.mode') mode: string,
    @Query('hub.challenge') challenge: string,
    @Query('hub.verify_token') verifyToken: string,
  ) {
    this.logger.log('WhatsApp webhook verification', 'WhatsappController');
    return this.whatsappService.verifyWebhook(mode, challenge, verifyToken);
  }

  @Post('send-message')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Enviar mensagem via WhatsApp' })
  @ApiResponse({
    status: 201,
    description: 'Mensagem enviada com sucesso',
  })
  async sendMessage(
    @CurrentUser('id') userId: string,
    @Body() sendMessageDto: SendMessageDto,
  ) {
    this.logger.log(`Sending WhatsApp message for user: ${userId}`, 'WhatsappController');
    return this.whatsappService.sendMessage(sendMessageDto.phoneNumber, sendMessageDto.message);
  }

  @Get('conversations')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obter conversas do WhatsApp do usuário' })
  @ApiResponse({
    status: 200,
    description: 'Lista de conversas',
  })
  async getConversations(@CurrentUser('id') userId: string) {
    this.logger.log(`Getting WhatsApp conversations for user: ${userId}`, 'WhatsappController');
    return this.whatsappService.getUserConversations(userId);
  }

  @Post('link-account')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Vincular conta do WhatsApp' })
  @ApiResponse({
    status: 201,
    description: 'Conta vinculada com sucesso',
  })
  async linkAccount(
    @CurrentUser('id') userId: string,
    @Body('phoneNumber') phoneNumber: string,
  ) {
    this.logger.log(`Linking WhatsApp account for user: ${userId}`, 'WhatsappController');
    return this.whatsappService.linkUserAccount(userId, phoneNumber);
  }

  @Get('status')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Verificar status da integração WhatsApp' })
  @ApiResponse({
    status: 200,
    description: 'Status da integração',
  })
  async getStatus(@CurrentUser('id') userId: string) {
    this.logger.log(`Getting WhatsApp status for user: ${userId}`, 'WhatsappController');
    return this.whatsappService.getIntegrationStatus(userId);
  }
}
