import { ApiProperty } from '@nestjs/swagger';
import { InteractionType } from '@prisma/client';

export class FeedbackBreakdownDto {
  @ApiProperty({
    description: 'Pontuação de originalidade (0-100)',
    example: 85,
  })
  originalidade: number;

  @ApiProperty({
    description: 'Pontuação de timing (0-100)',
    example: 78,
  })
  timing: number;

  @ApiProperty({
    description: 'Pontuação de humor (0-100)',
    example: 92,
  })
  humor: number;

  @ApiProperty({
    description: 'Pontuação de respeito (0-100)',
    example: 95,
  })
  respeito: number;

  @ApiProperty({
    description: 'Pontuação de contexto (0-100)',
    example: 88,
  })
  contexto: number;
}

export class InteractionFeedbackDto {
  @ApiProperty({
    description: 'Breakdown detalhado da pontuação',
    type: FeedbackBreakdownDto,
  })
  breakdown: FeedbackBreakdownDto;

  @ApiProperty({
    description: 'Sugestões de melhoria',
    example: ['Tente ser mais criativo', 'Use mais expressividade'],
    type: [String],
  })
  suggestions: string[];

  @ApiProperty({
    description: 'Próximo passo recomendado',
    example: 'Continue praticando para melhorar ainda mais!',
  })
  nextStep: string;
}

export class InteractionResponseDto {
  @ApiProperty({
    description: 'ID único da interação',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'Tipo de interação',
    enum: InteractionType,
    example: InteractionType.TEXT,
  })
  type: InteractionType;

  @ApiProperty({
    description: 'Conteúdo processado da interação',
    example: 'Oi, como você está hoje?',
  })
  content: string;

  @ApiProperty({
    description: 'Resposta da IA',
    example: 'Que divertido! 😄 Adorei sua criatividade nessa abordagem!',
  })
  aiResponse: string;

  @ApiProperty({
    description: 'Pontuação geral (0-100)',
    example: 85,
    required: false,
  })
  score?: number;

  @ApiProperty({
    description: 'Feedback detalhado',
    type: InteractionFeedbackDto,
    required: false,
  })
  feedback?: InteractionFeedbackDto;

  @ApiProperty({
    description: 'XP gerado pela interação',
    example: 15,
  })
  xpGenerated: number;

  @ApiProperty({
    description: 'Data de criação da interação',
    example: '2024-01-10T14:30:00Z',
  })
  createdAt: Date;
}
