import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { LoggerService } from '../common/services/logger.service';
import { CreatePaymentIntentDto } from './dto/create-payment-intent.dto';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';

@Injectable()
export class PaymentsService {
  constructor(
    private readonly database: DatabaseService,
    private readonly logger: LoggerService,
  ) {}

  async createPaymentIntent(userId: string, createPaymentIntentDto: CreatePaymentIntentDto) {
    const { amount, currency = 'BRL', plan } = createPaymentIntentDto;

    this.logger.log(`Creating payment intent for user ${userId}`, 'PaymentsService');

    // Check if user has active subscription
    const existingSubscription = await this.database.subscription.findUnique({
      where: { userId },
    });

    if (existingSubscription && existingSubscription.status === 'ACTIVE') {
      throw new BadRequestException('Usuário já possui uma assinatura ativa');
    }

    // Create payment record
    // Note: Payment model doesn't exist in current schema
    // const payment = await this.database.payment.create({
    //   data: {
    //     userId,
    //     amount,
    //     currency,
    //     status: 'PENDING',
    //     method: 'CREDIT_CARD',
    //     metadata: { plan },
    //   },
    // });

    // Mock Stripe payment intent creation
    const paymentIntentId = `pi_mock_${Date.now()}`;

    this.logger.log(`Payment intent created: ${paymentIntentId}`, 'PaymentsService');

    return {
      paymentIntentId,
      clientSecret: `${paymentIntentId}_secret_mock`,
      amount,
      currency,
      status: 'requires_payment_method',
    };
  }

  async createSubscription(userId: string, createSubscriptionDto: CreateSubscriptionDto) {
    const { plan, paymentMethodId } = createSubscriptionDto;

    this.logger.log(`Creating subscription for user ${userId}`, 'PaymentsService');

    // Check if user already has subscription
    const existingSubscription = await this.database.subscription.findUnique({
      where: { userId },
    });

    if (existingSubscription) {
      throw new BadRequestException('Usuário já possui uma assinatura');
    }

    // Create subscription
    const subscription = await this.database.subscription.create({
      data: {
        userId,
        plan: plan as any,
        status: 'ACTIVE',
        // paymentMethodId: paymentMethodId,  // This field exists in Subscription schema
        stripeSubscriptionId: `sub_mock_${Date.now()}`,
      },
    });

    this.logger.log(`Subscription created: ${subscription.id}`, 'PaymentsService');

    return subscription;
  }

  async getSubscriptionStatus(userId: string) {
    const subscription = await this.database.subscription.findUnique({
      where: { userId },
    });

    if (!subscription) {
      throw new NotFoundException('Assinatura não encontrada');
    }

    return {
      id: subscription.id,
      plan: subscription.plan,
      status: subscription.status,
      startDate: subscription.startDate,
      endDate: subscription.endDate,
      isActive: subscription.status === 'ACTIVE',
      daysUntilExpiry: subscription.endDate 
        ? Math.ceil((subscription.endDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
        : null,
    };
  }

  async getCurrentSubscription(userId: string) {
    return this.getSubscriptionStatus(userId);
  }

  async getPaymentMethods(userId: string) {
    // Mock payment methods
    return {
      methods: [],
      defaultMethod: null,
    };
  }

  async addPaymentMethod(userId: string, paymentMethodData: any) {
    // Mock add payment method
    return {
      id: `pm_mock_${Date.now()}`,
      type: 'card',
      last4: '4242',
      isDefault: false,
    };
  }

  async setDefaultPaymentMethod(userId: string, paymentMethodId: string) {
    // Mock set default
    return {
      success: true,
      message: 'Método de pagamento padrão atualizado',
    };
  }

  async getInvoices(userId: string, options: any) {
    // Mock invoices
    return {
      invoices: [],
      total: 0,
      page: options.page || 1,
      limit: options.limit || 10,
    };
  }

  async getAvailablePlans() {
    return [
      { id: 'FREE', name: 'Gratuito', price: 0, features: [] },
      { id: 'BASIC', name: 'Básico', price: 1999, features: [] },
      { id: 'PREMIUM', name: 'Premium', price: 3999, features: [] },
      { id: 'VIP', name: 'VIP', price: 9999, features: [] },
    ];
  }

  async handleStripeWebhook(body: any, signature: string) {
    return this.processWebhook('stripe', body, signature);
  }

  async handlePagarmeWebhook(body: any) {
    return this.processWebhook('pagarme', body, '');
  }

  async extendTrial(userId: string) {
    // Mock extend trial
    return {
      success: true,
      message: 'Trial estendido com sucesso',
      newEndDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    };
  }

  async getUsageData(userId: string) {
    // Mock usage data
    return {
      interactions: 150,
      limit: 1000,
      resetDate: new Date(),
    };
  }

  async cancelSubscription(userId: string) {
    const subscription = await this.database.subscription.findUnique({
      where: { userId },
    });

    if (!subscription) {
      throw new NotFoundException('Assinatura não encontrada');
    }

    if (subscription.status !== 'ACTIVE') {
      throw new BadRequestException('Assinatura não está ativa');
    }

    // Mock cancellation logic
    if (subscription.stripeSubscriptionId) {
      await this.cancelStripeSubscription(subscription.stripeSubscriptionId);
    } else if (subscription.pagarmeSubscriptionId) {
      await this.cancelPagarmeSubscription(subscription.pagarmeSubscriptionId);
    }

    // Update subscription status
    const updatedSubscription = await this.database.subscription.update({
      where: { id: subscription.id },
      data: {
        status: 'CANCELLED',
        endDate: new Date(),
      },
    });

    this.logger.log(`Subscription cancelled: ${subscription.id}`, 'PaymentsService');

    return updatedSubscription;
  }

  async reactivateSubscription(userId: string) {
    const subscription = await this.database.subscription.findUnique({
      where: { userId },
    });

    if (!subscription) {
      throw new NotFoundException('Assinatura não encontrada');
    }

    if (subscription.status === 'ACTIVE') {
      throw new BadRequestException('Assinatura já está ativa');
    }

    // Mock reactivation logic
    let reactivationData;
    if (subscription.stripeSubscriptionId) {
      reactivationData = await this.reactivateStripeSubscription(subscription.stripeSubscriptionId);
    } else if (subscription.pagarmeSubscriptionId) {
      reactivationData = await this.reactivatePagarmeSubscription(subscription.pagarmeSubscriptionId);
    }

    // Update subscription
    const updatedSubscription = await this.database.subscription.update({
      where: { id: subscription.id },
      data: {
        status: 'ACTIVE',
        endDate: null,
      },
    });

    this.logger.log(`Subscription reactivated: ${subscription.id}`, 'PaymentsService');

    return updatedSubscription;
  }

  async getPaymentHistory(userId: string) {
    // Note: Payment model doesn't exist in current schema
    // const payments = await this.database.payment.findMany({
    //   where: { userId },
    //   orderBy: { createdAt: 'desc' },
    // });

    // Mock payment history since Payment model doesn't exist
    const payments = [];

    return payments.map(payment => ({
      id: payment.id,
      amount: payment.amount,
      currency: payment.currency,
      status: payment.status,
      method: payment.method,
      createdAt: payment.createdAt,
    }));
  }

  async processWebhook(provider: string, payload: any, signature: string) {
    this.logger.log(`Processing webhook from ${provider}`, 'PaymentsService');

    if (provider === 'stripe') {
      return this.processStripeWebhook(payload, signature);
    } else if (provider === 'pagarme') {
      return this.processPagarmeWebhook(payload, signature);
    }

    throw new BadRequestException('Provedor não suportado');
  }

  private async processStripeWebhook(payload: any, signature: string) {
    // Mock Stripe webhook processing
    this.logger.log('Processing Stripe webhook', 'PaymentsService');
    return { received: true };
  }

  private async processPagarmeWebhook(payload: any, signature: string) {
    // Mock Pagar.me webhook processing
    this.logger.log('Processing Pagar.me webhook', 'PaymentsService');
    return { received: true };
  }

  private async cancelStripeSubscription(subscriptionId: string) {
    // Mock Stripe cancellation
    this.logger.log(`Cancelling Stripe subscription: ${subscriptionId}`, 'PaymentsService');
    return { status: 'canceled' };
  }

  private async cancelPagarmeSubscription(subscriptionId: string) {
    // Mock Pagar.me cancellation
    this.logger.log(`Cancelling Pagar.me subscription: ${subscriptionId}`, 'PaymentsService');
    return { status: 'canceled' };
  }

  private async reactivateStripeSubscription(subscriptionId: string) {
    // Mock Stripe reactivation
    this.logger.log(`Reactivating Stripe subscription: ${subscriptionId}`, 'PaymentsService');
    return { status: 'active' };
  }

  private async reactivatePagarmeSubscription(subscriptionId: string) {
    // Mock Pagar.me reactivation
    this.logger.log(`Reactivating Pagar.me subscription: ${subscriptionId}`, 'PaymentsService');
    return { status: 'active' };
  }

  private calculatePlanPrice(plan: string): number {
    const prices = {
      FREE: 0,
      BASIC: 1999, // R$ 19,99
      PREMIUM: 3999, // R$ 39,99
      VIP: 9999, // R$ 99,99
    };

    return prices[plan] || 0;
  }
}
