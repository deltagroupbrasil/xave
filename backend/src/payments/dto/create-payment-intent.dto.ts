import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, IsOptional, IsEnum, Min } from 'class-validator';

export enum PaymentProvider {
  STRIPE = 'STRIPE',
  PAGARME = 'PAGARME',
}

export class CreatePaymentIntentDto {
  @ApiProperty({
    description: 'Valor do pagamento em centavos',
    example: 1999,
    minimum: 1,
  })
  @IsNumber({}, { message: 'Valor deve ser um número' })
  @Min(1, { message: 'Valor deve ser maior que zero' })
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
    enum: ['FREE', 'BASIC', 'PREMIUM', 'VIP'],
    example: 'BASIC',
    required: false,
  })
  @IsOptional()
  @IsEnum(['FREE', 'BASIC', 'PREMIUM', 'VIP'], { message: 'Plano deve ser válido' })
  plan?: string;

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
