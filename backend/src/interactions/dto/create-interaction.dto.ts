import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEnum, IsNotEmpty, MaxLength } from 'class-validator';
import { InteractionType, Channel } from '@prisma/client';

export class CreateInteractionDto {
  @ApiProperty({
    description: 'Tipo de interação',
    enum: InteractionType,
    example: InteractionType.TEXT,
  })
  @IsEnum(InteractionType, { message: 'Tipo de interação deve ser válido' })
  type: InteractionType;

  @ApiProperty({
    description: 'Conteúdo da mensagem',
    example: 'Oi, como você está hoje?',
    maxLength: 500,
  })
  @IsString()
  @IsNotEmpty({ message: 'Conteúdo não pode estar vazio' })
  @MaxLength(500, { message: 'Conteúdo deve ter no máximo 500 caracteres' })
  content: string;

  @ApiProperty({
    description: 'Canal de origem da interação',
    enum: Channel,
    example: Channel.APP,
    default: Channel.APP,
  })
  @IsEnum(Channel, { message: 'Canal deve ser válido' })
  channel: Channel = Channel.APP;
}
