import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString, IsNotEmpty, IsOptional } from 'class-validator';

export enum PaymentProvider {
  STRIPE = 'STRIPE',
  PAGARME = 'PAGARME',
}

export class CreateSubscriptionDto {
  @ApiProperty({
    description: 'Plano de assinatura',
    enum: ['FREE', 'BASIC', 'PREMIUM', 'VIP'],
    example: 'BASIC',
  })
  @IsEnum(['FREE', 'BASIC', 'PREMIUM', 'VIP'], { message: 'Plano deve ser válido' })
  plan: string;

  @ApiProperty({
    description: 'ID do método de pagamento',
    example: 'pm_1234567890abcdef',
  })
  @IsString()
  @IsNotEmpty({ message: 'Método de pagamento é obrigatório' })
  paymentMethodId: string;

  @ApiProperty({
    description: 'Provedor de pagamento',
    enum: PaymentProvider,
    example: PaymentProvider.STRIPE,
    required: false,
  })
  @IsOptional()
  @IsEnum(PaymentProvider, { message: 'Provedor deve ser válido' })
  provider?: PaymentProvider = PaymentProvider.STRIPE;
}
