import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsEnum, IsInt, Min, Max } from 'class-validator';
import { Transform } from 'class-transformer';

export enum LeaderboardType {
  XP = 'xp',
  LEVEL = 'level',
  STREAK = 'streak',
}

export enum LeaderboardPeriod {
  ALL = 'all',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
}

export class GetLeaderboardDto {
  @ApiProperty({
    description: 'Tipo de ranking',
    enum: LeaderboardType,
    default: LeaderboardType.XP,
    required: false,
  })
  @IsOptional()
  @IsEnum(LeaderboardType, { message: 'Tipo de ranking deve ser válido' })
  type?: LeaderboardType = LeaderboardType.XP;

  @ApiProperty({
    description: 'Período do ranking',
    enum: LeaderboardPeriod,
    default: LeaderboardPeriod.ALL,
    required: false,
  })
  @IsOptional()
  @IsEnum(LeaderboardPeriod, { message: 'Período deve ser válido' })
  period?: LeaderboardPeriod = LeaderboardPeriod.ALL;

  @ApiProperty({
    description: 'Número máximo de usuários no ranking',
    example: 50,
    default: 50,
    minimum: 10,
    maximum: 100,
    required: false,
  })
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsInt({ message: 'Limite deve ser um número inteiro' })
  @Min(10, { message: 'Limite mínimo é 10' })
  @Max(100, { message: 'Limite máximo é 100' })
  limit?: number = 50;
}
