import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEnum, IsOptional, IsObject } from 'class-validator';

export enum PaymentMethodType {
  CARD = 'card',
  PIX = 'pix',
  BOLETO = 'boleto',
  BANK_TRANSFER = 'bank_transfer',
}

export class UpdatePaymentMethodDto {
  @ApiProperty({
    description: 'Tipo do método de pagamento',
    enum: PaymentMethodType,
    example: PaymentMethodType.CARD,
  })
  @IsEnum(PaymentMethodType, { message: 'Tipo de método de pagamento deve ser válido' })
  type: PaymentMethodType;

  @ApiProperty({
    description: 'Token do método de pagamento do provedor',
    example: 'pm_1234567890abcdef',
    required: false,
  })
  @IsOptional()
  @IsString()
  token?: string;

  @ApiProperty({
    description: 'Dados específicos do método de pagamento',
    example: {
      cardNumber: '4242424242424242',
      expiryMonth: '12',
      expiryYear: '2025',
      cvc: '123',
      holderName: 'João Silva',
    },
    required: false,
  })
  @IsOptional()
  @IsObject()
  paymentData?: Record<string, any>;

  @ApiProperty({
    description: 'Definir como método padrão',
    example: false,
    default: false,
    required: false,
  })
  @IsOptional()
  setAsDefault?: boolean = false;
}
