import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  Query,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { InteractionsService } from './interactions.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { CreateInteractionDto } from './dto/create-interaction.dto';
import { InteractionResponseDto } from './dto/interaction-response.dto';
import { GetInteractionsDto } from './dto/get-interactions.dto';
import { LoggerService } from '../common/services/logger.service';

@ApiTags('interactions')
@Controller('interactions')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class InteractionsController {
  constructor(
    private readonly interactionsService: InteractionsService,
    private readonly logger: LoggerService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Criar nova interação com IA' })
  @ApiResponse({
    status: 201,
    description: 'Interação processada com sucesso',
    type: InteractionResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Dados inválidos ou conteúdo inapropriado',
  })
  async createInteraction(
    @CurrentUser('id') userId: string,
    @Body() createInteractionDto: CreateInteractionDto,
  ): Promise<InteractionResponseDto> {
    this.logger.logInteraction(userId, createInteractionDto.channel || 'APP', 'text_interaction', {
      type: createInteractionDto.type,
    });

    return this.interactionsService.processInteraction(userId, createInteractionDto);
  }

  @Post('audio')
  @UseInterceptors(FileInterceptor('audio'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Processar interação de áudio' })
  @ApiResponse({
    status: 201,
    description: 'Áudio processado com sucesso',
    type: InteractionResponseDto,
  })
  async processAudio(
    @CurrentUser('id') userId: string,
    @UploadedFile() file: Express.Multer.File,
    @Body('channel') channel: string = 'APP',
  ): Promise<InteractionResponseDto> {
    if (!file) {
      throw new BadRequestException('Arquivo de áudio é obrigatório');
    }

    this.logger.logInteraction(userId, channel || 'APP', 'audio_interaction', {
      fileSize: file.size,
      mimeType: file.mimetype,
    });

    return this.interactionsService.processAudioInteraction(userId, file, channel);
  }

  @Post('image')
  @UseInterceptors(FileInterceptor('image'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Processar interação de imagem (análise de look)' })
  @ApiResponse({
    status: 201,
    description: 'Imagem processada com sucesso',
    type: InteractionResponseDto,
  })
  async processImage(
    @CurrentUser('id') userId: string,
    @UploadedFile() file: Express.Multer.File,
    @Body('eventType') eventType: string,
    @Body('channel') channel: string = 'APP',
  ): Promise<InteractionResponseDto> {
    if (!file) {
      throw new BadRequestException('Arquivo de imagem é obrigatório');
    }

    this.logger.logInteraction(userId, channel || 'APP', 'image_interaction', {
      fileSize: file.size,
      mimeType: file.mimetype,
      eventType,
      channel,
    });

    return this.interactionsService.processImageInteraction(userId, file, eventType, channel);
  }

  @Get()
  @ApiOperation({ summary: 'Obter histórico de interações' })
  @ApiResponse({
    status: 200,
    description: 'Lista de interações',
    type: [InteractionResponseDto],
  })
  async getInteractions(
    @CurrentUser('id') userId: string,
    @Query() query: GetInteractionsDto,
  ) {
    this.logger.log(`Getting interactions for user: ${userId}`, 'InteractionsController');
    return this.interactionsService.getUserInteractions(userId, query.limit || 10, (query as any).offset || 0);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Obter estatísticas de interações' })
  @ApiResponse({
    status: 200,
    description: 'Estatísticas de interações do usuário',
  })
  async getInteractionStats(@CurrentUser('id') userId: string) {
    this.logger.log(`Getting interaction stats for user: ${userId}`, 'InteractionsController');
    return this.interactionsService.getInteractionStats(userId);
  }
}
