import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsPhoneNumber } from 'class-validator';

export class SendMessageDto {
  @ApiProperty({
    description: 'Número de telefone do destinatário',
    example: '+5511999999999',
  })
  @IsString()
  @IsNotEmpty()
  @IsPhoneNumber('BR')
  phoneNumber: string;

  @ApiProperty({
    description: 'Mensagem a ser enviada',
    example: 'Olá! Como você está?',
  })
  @IsString()
  @IsNotEmpty()
  message: string;
}
