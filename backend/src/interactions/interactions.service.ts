import { Injectable, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { LoggerService } from '../common/services/logger.service';
import { AiOrchestratorService } from '../ai-orchestrator/ai-orchestrator.service';
import { CreateInteractionDto } from './dto/create-interaction.dto';
import { InteractionResponseDto } from './dto/interaction-response.dto';

@Injectable()
export class InteractionsService {
  constructor(
    private readonly database: DatabaseService,
    private readonly logger: LoggerService,
    private readonly aiOrchestrator: AiOrchestratorService,
  ) {}

  async processInteraction(userId: string, createInteractionDto: CreateInteractionDto): Promise<InteractionResponseDto> {
    const { type, content, channel = 'APP' } = createInteractionDto;

    try {
      // Validate content
      if (!content || content.trim().length === 0) {
        throw new BadRequestException('Conteúdo da interação é obrigatório');
      }

      // Moderate content first
      const moderation = await this.aiOrchestrator.moderateContent(content);
      if (!moderation.safe) {
        throw new BadRequestException(`Conteúdo inadequado: ${moderation.reason}`);
      }

      // Calculate score
      const score = this.calculateScore(content);

      // Generate AI response using OpenAI
      const aiResponse = await this.aiOrchestrator.generateChatResponse(content, userId);

      // Generate feedback
      const feedback = this.generateFeedback(content, score);
      
      // Calculate XP
      const xpGenerated = this.calculateXP(score);

      // Save interaction
      const interaction = await this.database.interaction.create({
        data: {
          userId,
          type: type as any,
          channel: channel as any,
          originalContent: content,
          processedContent: content,
          aiResponse,
          score,
          xpGenerated,
        },
      });

      // Update user stats
      if (xpGenerated > 0) {
        await this.updateUserStats(userId, xpGenerated);
      }

      return {
        id: interaction.id,
        type: type as any,
        content,
        aiResponse,
        score,
        feedback,
        xpGenerated,
        createdAt: interaction.createdAt,
      };
    } catch (error) {
      this.logger.error(
        `Error processing interaction for user ${userId}`,
        error.message,
        'InteractionsService',
      );
      throw new InternalServerErrorException('Erro ao processar interação');
    }
  }

  async processAudioInteraction(userId: string, file: Express.Multer.File, channel: string = 'APP'): Promise<InteractionResponseDto> {
    try {
      // Mock audio transcription
      const transcription = 'Olá, como você está hoje?';
      
      // Process as text interaction
      return this.processInteraction(userId, {
        type: 'AUDIO',
        content: transcription,
        channel: channel as any,
      });
    } catch (error) {
      this.logger.error(
        `Error processing audio interaction for user ${userId}`,
        error.message,
        'InteractionsService',
      );
      throw new InternalServerErrorException('Erro ao processar áudio');
    }
  }

  async processImageInteraction(userId: string, file: Express.Multer.File, eventType: string, channel: string = 'APP'): Promise<InteractionResponseDto> {
    try {
      // Mock fashion analysis
      const fashionFeedback = await this.analyzeFashion(file.buffer, eventType);

      // Save interaction
      const interaction = await this.database.interaction.create({
        data: {
          userId,
          type: 'IMAGE',
          channel: channel as any,
          originalContent: `Análise de look para ${eventType}`,
          processedContent: `Análise de look para ${eventType}`,
          aiResponse: fashionFeedback.response,
          score: fashionFeedback.score,
          xpGenerated: fashionFeedback.xpGenerated,
        },
      });

      // Update user stats
      if (fashionFeedback.xpGenerated > 0) {
        await this.updateUserStats(userId, fashionFeedback.xpGenerated);
      }

      return {
        id: interaction.id,
        type: 'IMAGE',
        content: `Análise de look para ${eventType}`,
        aiResponse: fashionFeedback.response,
        score: fashionFeedback.score,
        feedback: {
          breakdown: {
            originalidade: 75,
            timing: 80,
            humor: 70,
            respeito: 95,
            contexto: 85,
          },
          suggestions: fashionFeedback.feedback.suggestions,
          nextStep: 'Continue praticando para melhorar ainda mais!',
        },
        xpGenerated: fashionFeedback.xpGenerated,
        createdAt: interaction.createdAt,
      };
    } catch (error) {
      this.logger.error(
        `Error processing image interaction for user ${userId}`,
        error.message,
        'InteractionsService',
      );
      throw new InternalServerErrorException('Erro ao processar imagem');
    }
  }

  async getUserInteractions(userId: string, limit: number = 10, offset: number = 0) {
    const interactions = await this.database.interaction.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
    });

    return interactions.map(interaction => ({
      id: interaction.id,
      type: interaction.type,
      content: interaction.originalContent,
      aiResponse: interaction.aiResponse,
      score: interaction.score,
      xpEarned: interaction.xpGenerated,
      createdAt: interaction.createdAt,
    }));
  }

  async getInteractionStats(userId: string) {
    const stats = await this.database.interaction.aggregate({
      where: { userId },
      _count: { id: true },
      _avg: { score: true },
      _sum: { xpGenerated: true },
    });

    const typeStats = await this.database.interaction.groupBy({
      by: ['type'],
      where: { userId },
      _count: { type: true },
    });

    return {
      totalInteractions: stats._count.id || 0,
      averageScore: Math.round(stats._avg.score || 0),
      totalXpEarned: stats._sum.xpGenerated || 0,
      typeBreakdown: typeStats.reduce((acc, stat) => {
        acc[stat.type] = stat._count.type;
        return acc;
      }, {}),
    };
  }

  private async analyzeFashion(imageBuffer: Buffer, eventType: string) {
    // Mock fashion analysis
    const score = Math.floor(Math.random() * 30) + 70; // 70-100
    
    return {
      score,
      response: `Seu look está perfeito para ${eventType}! Você demonstra muito estilo e personalidade.`,
      feedback: {
        strengths: ['Combinação de cores harmoniosa', 'Estilo adequado ao evento'],
        suggestions: ['Considere adicionar um acessório', 'Experimente uma postura mais confiante'],
      },
      xpGenerated: Math.floor(score / 10),
    };
  }

  private generateAIResponse(content: string, personality: string): string {
    const responses = {
      PLAYFUL: [
        'Que interessante! Me conte mais sobre isso 😊',
        'Adorei sua criatividade! Continue assim!',
        'Você tem um jeito único de se expressar!',
      ],
      ROMANTIC: [
        'Suas palavras são muito tocantes...',
        'Que belo sentimento você expressou!',
        'Você tem uma alma muito sensível.',
      ],
      CONFIDENT: [
        'Excelente abordagem! Muito direto e claro.',
        'Gosto da sua confiança!',
        'Você sabe exatamente o que quer.',
      ],
    };

    const personalityResponses = responses[personality] || responses.PLAYFUL;
    return personalityResponses[Math.floor(Math.random() * personalityResponses.length)];
  }

  private calculateScore(content: string): number {
    // Simple scoring algorithm
    let score = 50; // Base score
    
    if (content.length > 10) score += 10;
    if (content.includes('?')) score += 5;
    if (content.includes('!')) score += 5;
    if (/[\u{1F600}-\u{1F64F}]/u.test(content)) score += 10; // Contains emoji
    if (content.length > 50) score += 10;
    if (/[aeiouAEIOU]/.test(content)) score += 5; // Has vowels (basic language check)
    
    return Math.min(Math.max(score, 0), 100);
  }

  private generateFeedback(content: string, score: number) {
    const feedback = {
      breakdown: {
        originalidade: Math.floor(Math.random() * 30) + 70,
        timing: Math.floor(Math.random() * 20) + 75,
        humor: Math.floor(Math.random() * 25) + 70,
        respeito: 95,
        contexto: Math.floor(Math.random() * 15) + 80,
      },
      suggestions: [],
      nextStep: '',
    };

    // Generate suggestions based on score
    if (score < 60) {
      feedback.suggestions.push('Tente ser mais expressivo');
      feedback.suggestions.push('Use mais detalhes na sua mensagem');
    } else if (score < 80) {
      feedback.suggestions.push('Adicione mais personalidade');
      feedback.suggestions.push('Considere usar emojis para expressar emoções');
    } else {
      feedback.suggestions.push('Excelente! Continue assim');
      feedback.suggestions.push('Você está no caminho certo');
    }

    // Generate next step
    if (score < 70) {
      feedback.nextStep = 'Continue praticando para melhorar sua pontuação!';
    } else if (score < 90) {
      feedback.nextStep = 'Você está indo bem! Tente ser ainda mais criativo.';
    } else {
      feedback.nextStep = 'Perfeito! Você domina a arte da comunicação!';
    }

    return feedback;
  }

  private calculateXP(score: number): number {
    // XP based on score
    if (score >= 90) return 25;
    if (score >= 80) return 20;
    if (score >= 70) return 15;
    if (score >= 60) return 10;
    return 5;
  }

  private async updateUserStats(userId: string, xpGained: number) {
    // Mock user stats update since UserStats table doesn't exist
    this.logger.log(`User ${userId} gained ${xpGained} XP`, 'InteractionsService');
  }
}
