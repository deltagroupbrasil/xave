import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Query,
  Param,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { MissionsService } from './missions.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { CreateCustomMissionDto } from './dto/create-custom-mission.dto';
import { GetMissionsDto } from './dto/get-missions.dto';
import { LoggerService } from '../common/services/logger.service';

@ApiTags('missions')
@Controller('missions')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class MissionsController {
  constructor(
    private readonly missionsService: MissionsService,
    private readonly logger: LoggerService,
  ) {}

  @Get('daily')
  @ApiOperation({ summary: 'Obter missões diárias disponíveis' })
  @ApiResponse({
    status: 200,
    description: 'Lista de missões diárias',
  })
  async getDailyMissions(@CurrentUser('id') userId: string) {
    this.logger.log(`Getting daily missions for user: ${userId}`, 'MissionsController');
    return this.missionsService.getDailyMissions(userId);
  }

  @Get('weekly')
  @ApiOperation({ summary: 'Obter missões semanais disponíveis' })
  @ApiResponse({
    status: 200,
    description: 'Lista de missões semanais',
  })
  async getWeeklyMissions(@CurrentUser('id') userId: string) {
    this.logger.log(`Getting weekly missions for user: ${userId}`, 'MissionsController');
    return this.missionsService.getWeeklyMissions(userId);
  }

  @Get('history')
  @ApiOperation({ summary: 'Obter histórico de missões completadas' })
  @ApiResponse({
    status: 200,
    description: 'Histórico de missões',
  })
  async getMissionHistory(
    @CurrentUser('id') userId: string,
    @Query() query: GetMissionsDto,
  ) {
    this.logger.log(`Getting mission history for user: ${userId}`, 'MissionsController');
    return this.missionsService.getMissionHistory(userId, query);
  }

  @Post(':missionId/start')
  @ApiOperation({ summary: 'Iniciar uma missão' })
  @ApiResponse({
    status: 201,
    description: 'Missão iniciada com sucesso',
  })
  @ApiResponse({
    status: 400,
    description: 'Missão não disponível ou já iniciada',
  })
  async startMission(
    @CurrentUser('id') userId: string,
    @Param('missionId') missionId: string,
  ) {
    this.logger.log(`Starting mission ${missionId} for user: ${userId}`, 'MissionsController');
    return this.missionsService.startMission(userId, missionId);
  }

  @Post(':missionId/complete')
  @ApiOperation({ summary: 'Completar uma missão' })
  @ApiResponse({
    status: 201,
    description: 'Missão completada com sucesso',
  })
  @ApiResponse({
    status: 400,
    description: 'Missão não pode ser completada',
  })
  async completeMission(
    @CurrentUser('id') userId: string,
    @Param('missionId') missionId: string,
  ) {
    this.logger.log(`Completing mission ${missionId} for user: ${userId}`, 'MissionsController');
    return this.missionsService.completeMission(userId, missionId);
  }

  @Get('progress')
  @ApiOperation({ summary: 'Obter progresso geral de missões' })
  @ApiResponse({
    status: 200,
    description: 'Progresso de missões do usuário',
  })
  async getMissionProgress(@CurrentUser('id') userId: string) {
    this.logger.log(`Getting mission progress for user: ${userId}`, 'MissionsController');
    return this.missionsService.getMissionProgress(userId);
  }

  @Get('suggestions')
  @ApiOperation({ summary: 'Obter sugestões de missões personalizadas' })
  @ApiResponse({
    status: 200,
    description: 'Sugestões de missões baseadas no perfil do usuário',
  })
  async getMissionSuggestions(@CurrentUser('id') userId: string) {
    this.logger.log(`Getting mission suggestions for user: ${userId}`, 'MissionsController');
    return this.missionsService.getMissionSuggestions(userId);
  }

  @Post('custom')
  @ApiOperation({ summary: 'Criar missão personalizada' })
  @ApiResponse({
    status: 201,
    description: 'Missão personalizada criada com sucesso',
  })
  @ApiResponse({
    status: 400,
    description: 'Dados inválidos para criação da missão',
  })
  async createCustomMission(
    @CurrentUser('id') userId: string,
    @Body() createCustomMissionDto: CreateCustomMissionDto,
  ) {
    this.logger.log(`Creating custom mission for user: ${userId}`, 'MissionsController');
    return this.missionsService.createCustomMission(userId, createCustomMissionDto);
  }

  @Get('streaks')
  @ApiOperation({ summary: 'Obter informações sobre streaks de missões' })
  @ApiResponse({
    status: 200,
    description: 'Informações de streaks de missões',
  })
  async getMissionStreaks(@CurrentUser('id') userId: string) {
    this.logger.log(`Getting mission streaks for user: ${userId}`, 'MissionsController');
    return this.missionsService.getMissionStreaks(userId);
  }
}
