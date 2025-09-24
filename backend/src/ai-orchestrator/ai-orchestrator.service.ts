import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { LoggerService } from '../common/services/logger.service';
import OpenAI from 'openai';

@Injectable()
export class AiOrchestratorService {
  private openai: OpenAI;

  constructor(
    private configService: ConfigService,
    private logger: LoggerService,
  ) {
    const apiKey = this.configService.get('OPENAI_API_KEY');

    if (apiKey && apiKey !== 'sk-your-openai-api-key') {
      this.openai = new OpenAI({
        apiKey: apiKey,
      });
      this.logger.log('OpenAI client initialized', 'AiOrchestratorService');
    } else {
      this.logger.warn('OpenAI API key not configured, using fallback responses', 'AiOrchestratorService');
    }
  }

  async generateChatResponse(
    message: string,
    userId: string,
    conversationHistory: Array<{ role: 'user' | 'assistant'; content: string }> = []
  ): Promise<string> {
    try {
      if (!this.openai) {
        return this.getFallbackResponse(message);
      }

      const systemPrompt = this.getSystemPrompt();

      const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
        { role: 'system', content: systemPrompt },
        ...conversationHistory,
        { role: 'user', content: message }
      ];

      const completion = await this.openai.chat.completions.create({
        model: this.configService.get('OPENAI_MODEL', 'gpt-3.5-turbo'),
        messages: messages,
        max_tokens: this.configService.get('OPENAI_MAX_TOKENS', 1000),
        temperature: this.configService.get('OPENAI_TEMPERATURE', 0.7),
        user: userId,
      });

      const response = completion.choices[0]?.message?.content;

      if (!response) {
        this.logger.warn('Empty response from OpenAI, using fallback', 'AiOrchestratorService');
        return this.getFallbackResponse(message);
      }

      this.logger.log(`Generated AI response for user ${userId}`, 'AiOrchestratorService');
      return response;

    } catch (error) {
      this.logger.error('Error generating AI response', error, 'AiOrchestratorService');
      return this.getFallbackResponse(message);
    }
  }

  async generateFlirtingAdvice(context: string, userLevel: number): Promise<string> {
    try {
      if (!this.openai) {
        return this.getFallbackAdvice(userLevel);
      }

      const prompt = this.getFlirtingAdvicePrompt(context, userLevel);

      const completion = await this.openai.chat.completions.create({
        model: this.configService.get('OPENAI_MODEL', 'gpt-3.5-turbo'),
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 500,
        temperature: 0.8,
      });

      return completion.choices[0]?.message?.content || this.getFallbackAdvice(userLevel);
    } catch (error) {
      this.logger.error('Error generating flirting advice', error, 'AiOrchestratorService');
      return this.getFallbackAdvice(userLevel);
    }
  }

  private getSystemPrompt(): string {
    return `Você é Sofia, uma mentora virtual especializada em ensinar técnicas de flerte e habilidades sociais de forma gamificada.

Características da sua personalidade:
- Amigável, encorajadora e empática
- Usa linguagem casual e divertida
- Oferece conselhos práticos e específicos
- Faz perguntas para engajar o usuário
- Celebra pequenos progressos
- Usa emojis ocasionalmente para ser mais expressiva

Seu objetivo é:
- Ajudar o usuário a desenvolver confiança em interações sociais
- Ensinar técnicas de flerte respeitosas e autênticas
- Gamificar o aprendizado com missões e desafios
- Fornecer feedback personalizado

Mantenha suas respostas:
- Entre 50-150 palavras
- Práticas e aplicáveis
- Positivas e motivadoras
- Focadas no desenvolvimento pessoal

Evite:
- Conselhos inadequados ou desrespeitosos
- Respostas muito longas
- Linguagem formal demais
- Julgamentos negativos`;
  }

  private getFlirtingAdvicePrompt(context: string, userLevel: number): string {
    const levelText = userLevel <= 2 ? 'iniciante' : userLevel <= 5 ? 'intermediário' : 'avançado';

    return `Como Sofia, uma mentora de flerte, forneça um conselho específico para um usuário ${levelText} nesta situação: "${context}".

    O conselho deve ser:
    - Prático e específico para o nível do usuário
    - Respeitoso e autêntico
    - Motivador e encorajador
    - Entre 100-200 palavras

    Inclua uma dica específica que eles podem usar hoje.`;
  }

  private getFallbackResponse(message: string): string {
    const responses = [
      "Que interessante! Conte-me mais sobre isso. 😊",
      "Hmm, entendo. E como você se sente em relação a isso?",
      "Essa é uma boa pergunta! Vamos explorar isso juntos.",
      "Você está indo muito bem! Continue assim! 💪",
      "Que tal tentarmos uma abordagem diferente? 🤔",
      "Adoro sua curiosidade! Isso mostra que você está realmente comprometido em melhorar.",
      "Cada conversa é uma oportunidade de praticar. O que você gostaria de focar hoje?",
      "Lembre-se: autenticidade é a melhor técnica de flerte! 💫",
      "Que situação específica você gostaria de trabalhar?",
      "Você já tentou usar humor natural em suas conversas? 😄"
    ];

    const messageWords = message.toLowerCase();

    if (messageWords.includes('ajuda') || messageWords.includes('help')) {
      return "Claro! Estou aqui para te ajudar a desenvolver suas habilidades sociais. Em que posso te auxiliar hoje? 😊";
    }

    if (messageWords.includes('nervoso') || messageWords.includes('ansiedade')) {
      return "É totalmente normal sentir nervosismo! Que tal começarmos com técnicas de respiração e praticar conversas casuais? 💪";
    }

    if (messageWords.includes('conversa') || messageWords.includes('falar')) {
      return "Ótimo tópico! A chave para boas conversas é mostrar interesse genuíno na outra pessoa. Que tal praticarmos algumas perguntas interessantes? 🗣️";
    }

    return responses[Math.floor(Math.random() * responses.length)];
  }

  private getFallbackAdvice(userLevel: number): string {
    const beginnerAdvices = [
      "Comece com um sorriso genuíno - é a forma universal de mostrar interesse! 😊",
      "Faça perguntas abertas sobre os interesses da pessoa. Mostre curiosidade genuína! 🤔",
      "Pratique escuta ativa - preste atenção no que a pessoa está dizendo realmente."
    ];

    const intermediateAdvices = [
      "Tente usar o 'eco emocional' - reflita os sentimentos que a pessoa expressa. 💭",
      "Compartilhe uma história pessoal leve para criar conexão. Vulnerabilidade controlada funciona!",
      "Use o humor situacional - comente algo engraçado do ambiente ao redor. 😄"
    ];

    const advancedAdvices = [
      "Experimente a técnica do 'callback' - faça referência a algo mencionado anteriormente na conversa. 🔄",
      "Pratique leitura de linguagem corporal e espelhamento sutil. 👥",
      "Crie momentos de tensão sexual respeitosa através de pausas estratégicas e contato visual. 👀"
    ];

    if (userLevel <= 2) {
      return beginnerAdvices[Math.floor(Math.random() * beginnerAdvices.length)];
    } else if (userLevel <= 5) {
      return intermediateAdvices[Math.floor(Math.random() * intermediateAdvices.length)];
    } else {
      return advancedAdvices[Math.floor(Math.random() * advancedAdvices.length)];
    }
  }

  async moderateContent(content: string): Promise<{ safe: boolean; reason?: string }> {
    try {
      if (!this.openai) {
        return { safe: true };
      }

      const moderation = await this.openai.moderations.create({
        input: content,
      });

      const result = moderation.results[0];

      if (result.flagged) {
        const categories = Object.entries(result.categories)
          .filter(([_, flagged]) => flagged)
          .map(([category, _]) => category);

        return {
          safe: false,
          reason: `Content flagged for: ${categories.join(', ')}`
        };
      }

      return { safe: true };
    } catch (error) {
      this.logger.error('Error in content moderation', error, 'AiOrchestratorService');
      return { safe: true }; // Fail safe
    }
  }
}