import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString, IsEnum, IsOptional, Min } from 'class-validator';
import { SubscriptionPlan } from '@prisma/client';
import { PaymentProvider } from './create-subscription.dto';

export class CreatePaymentIntentDto {
  @ApiProperty({
    description: 'Valor em centavos (ex: 1999 = R$ 19,99)',
    example: 1999,
    minimum: 100,
  })
  @IsInt({ message: 'Valor deve ser um número inteiro' })
  @Min(100, { message: 'Valor mínimo é R$ 1,00 (100 centavos)' })
  amount: number;

  @ApiProperty({
    description: 'Moeda do pagamento',
    example: 'BRL',
    default: 'BRL',
    required: false,
  })
  @IsOptional()
  @IsString()
  currency?: string = 'BRL';

  @ApiProperty({
    description: 'Plano relacionado ao pagamento',
    enum: SubscriptionPlan,
    example: 'BASIC',
    required: false,
  })
  @IsOptional()
  @IsEnum(SubscriptionPlan, { message: 'Plano deve ser válido' })
  plan?: SubscriptionPlan;

  @ApiProperty({
    description: 'Provedor de pagamento',
    enum: PaymentProvider,
    example: PaymentProvider.STRIPE,
    default: PaymentProvider.STRIPE,
    required: false,
  })
  @IsOptional()
  @IsEnum(PaymentProvider, { message: 'Provedor deve ser válido' })
  provider?: PaymentProvider = PaymentProvider.STRIPE;
}
