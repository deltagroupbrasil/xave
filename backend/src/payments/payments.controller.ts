import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  Query,
  Param,
  Headers,
  RawBody,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { PaymentsService } from './payments.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { CreatePaymentIntentDto } from './dto/create-payment-intent.dto';
import { UpdatePaymentMethodDto } from './dto/update-payment-method.dto';
import { LoggerService } from '../common/services/logger.service';

@ApiTags('payments')
@Controller('payments')
export class PaymentsController {
  constructor(
    private readonly paymentsService: PaymentsService,
    private readonly logger: LoggerService,
  ) {}

  @Post('subscription')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Criar nova assinatura' })
  @ApiResponse({
    status: 201,
    description: 'Assinatura criada com sucesso',
  })
  @ApiResponse({
    status: 400,
    description: 'Dados inválidos ou usuário já possui assinatura ativa',
  })
  async createSubscription(
    @CurrentUser('id') userId: string,
    @Body() createSubscriptionDto: CreateSubscriptionDto,
  ) {
    this.logger.logPayment(userId, 0, 'BRL', 'subscription_created');
    return this.paymentsService.createSubscription(userId, createSubscriptionDto);
  }

  @Post('payment-intent')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Criar intenção de pagamento' })
  @ApiResponse({
    status: 201,
    description: 'Intenção de pagamento criada',
  })
  async createPaymentIntent(
    @CurrentUser('id') userId: string,
    @Body() createPaymentIntentDto: CreatePaymentIntentDto,
  ) {
    this.logger.log(`Creating payment intent for user: ${userId}`, 'PaymentsController');
    return this.paymentsService.createPaymentIntent(userId, createPaymentIntentDto);
  }

  @Get('subscription')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obter dados da assinatura atual' })
  @ApiResponse({
    status: 200,
    description: 'Dados da assinatura',
  })
  async getCurrentSubscription(@CurrentUser('id') userId: string) {
    this.logger.log(`Getting subscription for user: ${userId}`, 'PaymentsController');
    return this.paymentsService.getCurrentSubscription(userId);
  }

  @Post('subscription/cancel')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cancelar assinatura' })
  @ApiResponse({
    status: 200,
    description: 'Assinatura cancelada com sucesso',
  })
  async cancelSubscription(@CurrentUser('id') userId: string) {
    this.logger.log(`Canceling subscription for user: ${userId}`, 'PaymentsController');
    return this.paymentsService.cancelSubscription(userId);
  }

  @Post('subscription/reactivate')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Reativar assinatura cancelada' })
  @ApiResponse({
    status: 200,
    description: 'Assinatura reativada com sucesso',
  })
  async reactivateSubscription(@CurrentUser('id') userId: string) {
    this.logger.log(`Reactivating subscription for user: ${userId}`, 'PaymentsController');
    return this.paymentsService.reactivateSubscription(userId);
  }

  @Get('payment-methods')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Listar métodos de pagamento do usuário' })
  @ApiResponse({
    status: 200,
    description: 'Lista de métodos de pagamento',
  })
  async getPaymentMethods(@CurrentUser('id') userId: string) {
    this.logger.log(`Getting payment methods for user: ${userId}`, 'PaymentsController');
    return this.paymentsService.getPaymentMethods(userId);
  }

  @Post('payment-methods')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Adicionar novo método de pagamento' })
  @ApiResponse({
    status: 201,
    description: 'Método de pagamento adicionado',
  })
  async addPaymentMethod(
    @CurrentUser('id') userId: string,
    @Body() updatePaymentMethodDto: UpdatePaymentMethodDto,
  ) {
    this.logger.log(`Adding payment method for user: ${userId}`, 'PaymentsController');
    return this.paymentsService.addPaymentMethod(userId, updatePaymentMethodDto);
  }

  @Post('payment-methods/:paymentMethodId/default')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Definir método de pagamento padrão' })
  @ApiResponse({
    status: 200,
    description: 'Método de pagamento padrão atualizado',
  })
  async setDefaultPaymentMethod(
    @CurrentUser('id') userId: string,
    @Param('paymentMethodId') paymentMethodId: string,
  ) {
    this.logger.log(`Setting default payment method for user: ${userId}`, 'PaymentsController');
    return this.paymentsService.setDefaultPaymentMethod(userId, paymentMethodId);
  }

  @Get('invoices')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obter histórico de faturas' })
  @ApiResponse({
    status: 200,
    description: 'Lista de faturas',
  })
  async getInvoices(
    @CurrentUser('id') userId: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
  ) {
    this.logger.log(`Getting invoices for user: ${userId}`, 'PaymentsController');
    return this.paymentsService.getInvoices(userId, { page, limit });
  }

  @Get('plans')
  @ApiOperation({ summary: 'Listar planos de assinatura disponíveis' })
  @ApiResponse({
    status: 200,
    description: 'Lista de planos disponíveis',
  })
  async getAvailablePlans() {
    this.logger.log('Getting available subscription plans', 'PaymentsController');
    return this.paymentsService.getAvailablePlans();
  }

  // Webhook endpoints
  @Post('webhooks/stripe')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Webhook do Stripe' })
  async handleStripeWebhook(
    @RawBody() body: Buffer,
    @Headers('stripe-signature') signature: string,
  ) {
    this.logger.log('Received Stripe webhook', 'PaymentsController');
    return this.paymentsService.handleStripeWebhook(body, signature);
  }

  @Post('webhooks/pagarme')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Webhook do Pagar.me' })
  async handlePagarmeWebhook(@Body() body: any) {
    this.logger.log('Received Pagar.me webhook', 'PaymentsController');
    return this.paymentsService.handlePagarmeWebhook(body);
  }

  @Get('trial/extend')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Estender período de trial' })
  @ApiResponse({
    status: 200,
    description: 'Trial estendido com sucesso',
  })
  async extendTrial(@CurrentUser('id') userId: string) {
    this.logger.log(`Extending trial for user: ${userId}`, 'PaymentsController');
    return this.paymentsService.extendTrial(userId);
  }

  @Get('usage')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obter dados de uso da assinatura' })
  @ApiResponse({
    status: 200,
    description: 'Dados de uso da assinatura',
  })
  async getUsageData(@CurrentUser('id') userId: string) {
    this.logger.log(`Getting usage data for user: ${userId}`, 'PaymentsController');
    return this.paymentsService.getUsageData(userId);
  }
}
