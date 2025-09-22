import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class ClaimAchievementDto {
  @ApiProperty({
    description: 'ID da conquista a ser reivindicada',
    example: 'first-interaction',
  })
  @IsString()
  @IsNotEmpty({ message: 'ID da conquista é obrigatório' })
  achievementId: string;
}
