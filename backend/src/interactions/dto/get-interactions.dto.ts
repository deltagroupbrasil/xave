import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsEnum, IsInt, Min, Max } from 'class-validator';
import { Transform } from 'class-transformer';
import { InteractionType, Channel } from '@prisma/client';

export class GetInteractionsDto {
  @ApiProperty({
    description: 'Número da página',
    example: 1,
    default: 1,
    required: false,
  })
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsInt({ message: 'Página deve ser um número inteiro' })
  @Min(1, { message: 'Página deve ser maior que 0' })
  page?: number = 1;

  @ApiProperty({
    description: 'Número de itens por página',
    example: 20,
    default: 20,
    minimum: 1,
    maximum: 100,
    required: false,
  })
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsInt({ message: 'Limite deve ser um número inteiro' })
  @Min(1, { message: 'Limite deve ser maior que 0' })
  @Max(100, { message: 'Limite deve ser menor ou igual a 100' })
  limit?: number = 20;

  @ApiProperty({
    description: 'Filtrar por tipo de interação',
    enum: InteractionType,
    required: false,
  })
  @IsOptional()
  @IsEnum(InteractionType, { message: 'Tipo de interação deve ser válido' })
  type?: InteractionType;

  @ApiProperty({
    description: 'Filtrar por canal',
    enum: Channel,
    required: false,
  })
  @IsOptional()
  @IsEnum(Channel, { message: 'Canal deve ser válido' })
  channel?: Channel;
}
