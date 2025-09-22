import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsObject,
  IsInt,
  Min,
  Max,
  MaxLength,
} from 'class-validator';
import { MissionType } from '@prisma/client';

export class CreateCustomMissionDto {
  @ApiProperty({
    description: 'Título da missão personalizada',
    example: 'Minha Missão Especial',
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty({ message: 'Título é obrigatório' })
  @MaxLength(100, { message: 'Título deve ter no máximo 100 caracteres' })
  title: string;

  @ApiProperty({
    description: 'Descrição detalhada da missão',
    example: 'Complete 5 interações com pontuação acima de 80',
    maxLength: 500,
  })
  @IsString()
  @IsNotEmpty({ message: 'Descrição é obrigatória' })
  @MaxLength(500, { message: 'Descrição deve ter no máximo 500 caracteres' })
  description: string;

  @ApiProperty({
    description: 'Tipo da missão',
    enum: MissionType,
    example: MissionType.DAILY,
  })
  @IsEnum(MissionType, { message: 'Tipo de missão deve ser válido' })
  type: MissionType;

  @ApiProperty({
    description: 'Requisitos para completar a missão',
    example: {
      type: 'text_interaction',
      count: 5,
      minScore: 80,
    },
  })
  @IsObject({ message: 'Requisitos devem ser um objeto válido' })
  requirements: Record<string, any>;

  @ApiProperty({
    description: 'Recompensa em XP (limitada pelo nível do usuário)',
    example: 50,
    minimum: 10,
    maximum: 500,
  })
  @IsInt({ message: 'Recompensa XP deve ser um número inteiro' })
  @Min(10, { message: 'Recompensa mínima é 10 XP' })
  @Max(500, { message: 'Recompensa máxima é 500 XP' })
  xpReward: number;
}
