import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsEnum, IsInt, Min, Max, IsBoolean } from 'class-validator';
import { Transform } from 'class-transformer';
import { MissionType } from '@prisma/client';

export class GetMissionsDto {
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
    description: 'Filtrar por tipo de missão',
    enum: MissionType,
    required: false,
  })
  @IsOptional()
  @IsEnum(MissionType, { message: 'Tipo de missão deve ser válido' })
  type?: MissionType;

  @ApiProperty({
    description: 'Filtrar por status de conclusão',
    example: true,
    required: false,
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  @IsBoolean({ message: 'Status de conclusão deve ser verdadeiro ou falso' })
  completed?: boolean;
}
