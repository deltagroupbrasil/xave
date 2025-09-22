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
import { GamificationService } from './gamification.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { ClaimAchievementDto } from './dto/claim-achievement.dto';
import { GetLeaderboardDto } from './dto/get-leaderboard.dto';
import { LoggerService } from '../common/services/logger.service';

@ApiTags('gamification')
@Controller('gamification')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class GamificationController {
  constructor(
    private readonly gamificationService: GamificationService,
    private readonly logger: LoggerService,
  ) {}

  @Get('profile')
  @ApiOperation({ summary: 'Obter perfil de gamificação do usuário' })
  @ApiResponse({
    status: 200,
    description: 'Perfil de gamificação do usuário',
  })
  async getGamificationProfile(@CurrentUser('id') userId: string) {
    this.logger.log(`Getting gamification profile for user: ${userId}`, 'GamificationController');
    return this.gamificationService.getUserGamificationProfile(userId);
  }

  @Get('achievements')
  @ApiOperation({ summary: 'Listar conquistas disponíveis e do usuário' })
  @ApiResponse({
    status: 200,
    description: 'Lista de conquistas',
  })
  async getAchievements(@CurrentUser('id') userId: string) {
    this.logger.log(`Getting achievements for user: ${userId}`, 'GamificationController');
    return this.gamificationService.getUserAchievements(userId);
  }

  @Post('achievements/claim')
  @ApiOperation({ summary: 'Reivindicar uma conquista' })
  @ApiResponse({
    status: 201,
    description: 'Conquista reivindicada com sucesso',
  })
  @ApiResponse({
    status: 400,
    description: 'Conquista não disponível ou já reivindicada',
  })
  async claimAchievement(
    @CurrentUser('id') userId: string,
    @Body() claimAchievementDto: ClaimAchievementDto,
  ) {
    this.logger.log(`Claiming achievement ${claimAchievementDto.achievementId} for user: ${userId}`, 'GamificationController');
    return this.gamificationService.claimAchievement(userId, claimAchievementDto.achievementId);
  }

  @Get('leaderboard')
  @ApiOperation({ summary: 'Obter ranking de usuários' })
  @ApiResponse({
    status: 200,
    description: 'Ranking de usuários',
  })
  async getLeaderboard(
    @CurrentUser('id') userId: string,
    @Query() query: GetLeaderboardDto,
  ) {
    this.logger.log(`Getting leaderboard for user: ${userId}`, 'GamificationController');
    return this.gamificationService.getLeaderboard(query.limit || 10);
  }

  @Get('daily-missions')
  @ApiOperation({ summary: 'Obter missões diárias do usuário' })
  @ApiResponse({
    status: 200,
    description: 'Missões diárias disponíveis',
  })
  async getDailyMissions(@CurrentUser('id') userId: string) {
    this.logger.log(`Getting daily missions for user: ${userId}`, 'GamificationController');
    return this.gamificationService.getDailyMissions(userId);
  }

  @Get('weekly-missions')
  @ApiOperation({ summary: 'Obter missões semanais do usuário' })
  @ApiResponse({
    status: 200,
    description: 'Missões semanais disponíveis',
  })
  async getWeeklyMissions(@CurrentUser('id') userId: string) {
    this.logger.log(`Getting weekly missions for user: ${userId}`, 'GamificationController');
    return this.gamificationService.getWeeklyMissions(userId);
  }

  @Post('missions/:missionId/complete')
  @ApiOperation({ summary: 'Marcar missão como completa' })
  @ApiResponse({
    status: 201,
    description: 'Missão completada com sucesso',
  })
  @ApiResponse({
    status: 400,
    description: 'Missão não disponível ou já completada',
  })
  async completeMission(
    @CurrentUser('id') userId: string,
    @Param('missionId') missionId: string,
  ) {
    this.logger.log(`Completing mission ${missionId} for user: ${userId}`, 'GamificationController');
    return this.gamificationService.completeMission(userId, missionId);
  }

  @Get('level-progress')
  @ApiOperation({ summary: 'Obter progresso de nível do usuário' })
  @ApiResponse({
    status: 200,
    description: 'Progresso de nível e XP',
  })
  async getLevelProgress(@CurrentUser('id') userId: string) {
    this.logger.log(`Getting level progress for user: ${userId}`, 'GamificationController');
    return this.gamificationService.getLevelProgress(userId);
  }

  @Get('streak')
  @ApiOperation({ summary: 'Obter informações de streak do usuário' })
  @ApiResponse({
    status: 200,
    description: 'Informações de streak diário',
  })
  async getStreak(@CurrentUser('id') userId: string) {
    this.logger.log(`Getting streak info for user: ${userId}`, 'GamificationController');
    return this.gamificationService.getStreakInfo(userId);
  }

  @Get('skills')
  @ApiOperation({ summary: 'Obter habilidades e progressos do usuário' })
  @ApiResponse({
    status: 200,
    description: 'Habilidades e níveis de skill',
  })
  async getSkills(@CurrentUser('id') userId: string) {
    this.logger.log(`Getting skills for user: ${userId}`, 'GamificationController');
    return this.gamificationService.getUserSkills(userId);
  }
}
