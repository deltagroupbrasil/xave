import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { LoggerService } from '../common/services/logger.service';
import { CreateCustomMissionDto } from './dto/create-custom-mission.dto';
import { GetMissionsDto } from './dto/get-missions.dto';
import { MissionType } from '@prisma/client';

@Injectable()
export class MissionsService {
  constructor(
    private readonly database: DatabaseService,
    private readonly logger: LoggerService,
  ) {}

  async getDailyMissions(userId: string) {
    const today = this.getStartOfDay();
    
    // Get all daily missions
    const dailyMissions = await this.database.mission.findMany({
      where: { type: MissionType.DAILY },
      orderBy: { xpReward: 'asc' },
    });

    // Get user's completed missions for today
    const completedToday = await this.database.userMission.findMany({
      where: {
        userId,
        missionId: { in: dailyMissions.map(m => m.id) },
        completedAt: { gte: today },
      },
    });

    const completedIds = new Set(completedToday.map(um => um.missionId));

    return {
      missions: dailyMissions.map(mission => ({
        ...mission,
        completed: completedIds.has(mission.id),
        completedAt: completedToday.find(um => um.missionId === mission.id)?.completedAt,
        progress: this.calculateMissionProgress(userId, mission),
      })),
      totalCompleted: completedToday.length,
      totalAvailable: dailyMissions.length,
      resetTime: this.getEndOfDay(),
    };
  }

  async getWeeklyMissions(userId: string) {
    const startOfWeek = this.getStartOfWeek();
    
    // Get all weekly missions
    const weeklyMissions = await this.database.mission.findMany({
      where: { type: MissionType.WEEKLY },
      orderBy: { xpReward: 'asc' },
    });

    // Get user's completed missions for this week
    const completedThisWeek = await this.database.userMission.findMany({
      where: {
        userId,
        missionId: { in: weeklyMissions.map(m => m.id) },
        completedAt: { gte: startOfWeek },
      },
    });

    const completedIds = new Set(completedThisWeek.map(um => um.missionId));

    return {
      missions: weeklyMissions.map(mission => ({
        ...mission,
        completed: completedIds.has(mission.id),
        completedAt: completedThisWeek.find(um => um.missionId === mission.id)?.completedAt,
        progress: this.calculateMissionProgress(userId, mission),
      })),
      totalCompleted: completedThisWeek.length,
      totalAvailable: weeklyMissions.length,
      resetTime: this.getEndOfWeek(),
    };
  }

  async getMissionHistory(userId: string, query: GetMissionsDto) {
    const { page = 1, limit = 20, type, completed } = query;
    const skip = (page - 1) * limit;

    const where: any = { userId };
    
    if (type) {
      const missions = await this.database.mission.findMany({
        where: { type },
        select: { id: true },
      });
      where.missionId = { in: missions.map(m => m.id) };
    }

    if (completed !== undefined) {
      if (completed) {
        where.completedAt = { not: null };
      } else {
        where.completedAt = null;
      }
    }

    const [userMissions, total] = await Promise.all([
      this.database.userMission.findMany({
        where,
        include: { mission: true },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.database.userMission.count({ where }),
    ]);

    return {
      missions: userMissions.map(um => ({
        ...um.mission,
        startedAt: um.createdAt,
        completedAt: um.completedAt,
        xpAwarded: um.completedAt ? um.mission.xpReward : 0,
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async startMission(userId: string, missionId: string) {
    const mission = await this.database.mission.findUnique({
      where: { id: missionId },
    });

    if (!mission) {
      throw new NotFoundException('Missão não encontrada');
    }

    // Check if mission is already started
    const existingUserMission = await this.database.userMission.findFirst({
      where: {
        userId,
        missionId,
        completedAt: null,
      },
    });

    if (existingUserMission) {
      throw new BadRequestException('Missão já foi iniciada');
    }

    // Check if mission was already completed in the current period
    const periodStart = mission.type === MissionType.DAILY 
      ? this.getStartOfDay() 
      : this.getStartOfWeek();

    const completedInPeriod = await this.database.userMission.findFirst({
      where: {
        userId,
        missionId,
        completedAt: { gte: periodStart },
      },
    });

    if (completedInPeriod) {
      throw new BadRequestException('Missão já foi completada no período atual');
    }

    const userMission = await this.database.userMission.create({
      data: {
        userId,
        missionId,
      },
      include: { mission: true },
    });

    this.logger.log(`Mission ${missionId} started by user ${userId}`, 'MissionsService');

    return {
      mission: userMission.mission,
      startedAt: userMission.createdAt,
      progress: 0,
    };
  }

  async completeMission(userId: string, missionId: string) {
    const userMission = await this.database.userMission.findFirst({
      where: {
        userId,
        missionId,
        completedAt: null,
      },
      include: { mission: true },
    });

    if (!userMission) {
      throw new NotFoundException('Missão não foi iniciada ou já foi completada');
    }

    // Validate mission completion requirements
    const canComplete = await this.validateMissionCompletion(userId, userMission.mission);
    
    if (!canComplete) {
      throw new BadRequestException('Requisitos da missão não foram atendidos');
    }

    // Complete mission and award XP
    const [completedMission] = await this.database.$transaction([
      this.database.userMission.update({
        where: { id: userMission.id },
        data: { completedAt: new Date() },
        include: { mission: true },
      }),
      this.database.userStats.update({
        where: { userId },
        data: {
          totalXp: { increment: userMission.mission.xpReward },
          totalInteractions: { increment: 1 },
        },
      }),
    ]);

    // Update daily streak if it's a daily mission
    if (userMission.mission.type === MissionType.DAILY) {
      await this.updateDailyMissionStreak(userId);
    }

    this.logger.log(`Mission ${missionId} completed by user ${userId}`, 'MissionsService');

    return {
      mission: completedMission.mission,
      completedAt: completedMission.completedAt,
      xpAwarded: userMission.mission.xpReward,
    };
  }

  async getMissionProgress(userId: string) {
    const today = this.getStartOfDay();
    const startOfWeek = this.getStartOfWeek();

    const [dailyProgress, weeklyProgress, totalCompleted] = await Promise.all([
      this.database.userMission.count({
        where: {
          userId,
          completedAt: { gte: today },
          mission: { type: MissionType.DAILY },
        },
      }),
      this.database.userMission.count({
        where: {
          userId,
          completedAt: { gte: startOfWeek },
          mission: { type: MissionType.WEEKLY },
        },
      }),
      this.database.userMission.count({
        where: {
          userId,
          completedAt: { not: null },
        },
      }),
    ]);

    const [totalDaily, totalWeekly] = await Promise.all([
      this.database.mission.count({ where: { type: MissionType.DAILY } }),
      this.database.mission.count({ where: { type: MissionType.WEEKLY } }),
    ]);

    return {
      daily: {
        completed: dailyProgress,
        total: totalDaily,
        percentage: totalDaily > 0 ? (dailyProgress / totalDaily) * 100 : 0,
      },
      weekly: {
        completed: weeklyProgress,
        total: totalWeekly,
        percentage: totalWeekly > 0 ? (weeklyProgress / totalWeekly) * 100 : 0,
      },
      allTime: {
        completed: totalCompleted,
      },
    };
  }

  async getMissionSuggestions(userId: string) {
    // Get user stats and preferences to suggest personalized missions
    const userStats = await this.database.userStats.findUnique({
      where: { userId },
    });

    const userCharacter = await this.database.characterConfig.findUnique({
      where: { userId },
    });

    // Get recent interactions to understand user behavior
    const recentInteractions = await this.database.interaction.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 10,
    });

    // Generate suggestions based on user profile
    const suggestions = this.generateMissionSuggestions(userStats, userCharacter, recentInteractions);

    return {
      suggestions,
      basedOn: {
        level: userStats?.currentLevel || 1,
        personality: userCharacter?.personality || 'PLAYFUL',
        recentActivity: recentInteractions.length,
      },
    };
  }

  async createCustomMission(userId: string, createCustomMissionDto: CreateCustomMissionDto) {
    const { title, description, requirements, xpReward, type } = createCustomMissionDto;

    // Validate XP reward based on user level
    const userStats = await this.database.userStats.findUnique({
      where: { userId },
    });

    const maxXpReward = (userStats?.currentLevel || 1) * 50;
    if (xpReward > maxXpReward) {
      throw new BadRequestException(`XP reward cannot exceed ${maxXpReward} for your level`);
    }

    const customMission = await this.database.mission.create({
      data: {
        id: `custom-${userId}-${Date.now()}`,
        type,
        title,
        description,
        requirements,
        xpReward,
      },
    });

    this.logger.log(`Custom mission created by user ${userId}`, 'MissionsService');

    return {
      mission: customMission,
      message: 'Missão personalizada criada com sucesso',
    };
  }

  async getMissionStreaks(userId: string) {
    const userStats = await this.database.userStats.findUnique({
      where: { userId },
    });

    // Calculate daily mission streak
    const dailyStreak = await this.calculateDailyMissionStreak(userId);
    
    // Calculate weekly mission streak
    const weeklyStreak = await this.calculateWeeklyMissionStreak(userId);

    return {
      daily: {
        current: dailyStreak.current,
        longest: dailyStreak.longest,
        isActiveToday: dailyStreak.isActiveToday,
      },
      weekly: {
        current: weeklyStreak.current,
        longest: weeklyStreak.longest,
        isActiveThisWeek: weeklyStreak.isActiveThisWeek,
      },
      overall: {
        totalMissionsCompleted: userStats?.totalInteractions || 0,
        averagePerDay: this.calculateAverageMissionsPerDay(userId),
      },
    };
  }

  // Private helper methods
  private async calculateMissionProgress(userId: string, mission: any): Promise<number> {
    const requirements = mission.requirements;
    
    // This would implement specific logic for each mission type
    // For now, return a placeholder based on recent activity
    const recentInteractions = await this.database.interaction.count({
      where: {
        userId,
        createdAt: { gte: this.getStartOfDay() },
      },
    });

    return Math.min((recentInteractions / (requirements.count || 1)) * 100, 100);
  }

  private async validateMissionCompletion(userId: string, mission: any): Promise<boolean> {
    const requirements = mission.requirements;
    
    // Validate based on mission requirements
    if (requirements.type === 'text_interaction') {
      const interactions = await this.database.interaction.count({
        where: {
          userId,
          type: 'TEXT',
          createdAt: { gte: this.getStartOfDay() },
        },
      });
      
      return interactions >= (requirements.count || 1);
    }

    if (requirements.type === 'fashion_analysis') {
      const analyses = await this.database.fashionAnalysis.count({
        where: {
          userId,
          createdAt: { gte: this.getStartOfDay() },
        },
      });
      
      return analyses >= (requirements.count || 1);
    }

    // Add more validation logic for different mission types
    return true;
  }

  private generateMissionSuggestions(userStats: any, userCharacter: any, recentInteractions: any[]) {
    const suggestions = [];
    
    const level = userStats?.currentLevel || 1;
    const personality = userCharacter?.personality || 'PLAYFUL';

    // Suggest missions based on personality
    if (personality === 'PLAYFUL') {
      suggestions.push({
        title: 'Contador de Piadas',
        description: 'Faça 3 pessoas rirem com suas piadas hoje',
        xpReward: level * 25,
        difficulty: 'medium',
      });
    }

    if (personality === 'ROMANTIC') {
      suggestions.push({
        title: 'Poeta do Amor',
        description: 'Escreva um elogio poético e criativo',
        xpReward: level * 30,
        difficulty: 'hard',
      });
    }

    // Suggest based on recent activity
    if (recentInteractions.length < 3) {
      suggestions.push({
        title: 'Quebra-Gelo',
        description: 'Inicie 5 conversas diferentes hoje',
        xpReward: level * 20,
        difficulty: 'easy',
      });
    }

    return suggestions.slice(0, 3); // Return top 3 suggestions
  }

  private async updateDailyMissionStreak(userId: string) {
    // Implementation for updating daily mission streak
    // This would track consecutive days of mission completion
  }

  private async calculateDailyMissionStreak(userId: string) {
    // Calculate current daily mission streak
    return {
      current: 5, // Placeholder
      longest: 12, // Placeholder
      isActiveToday: true,
    };
  }

  private async calculateWeeklyMissionStreak(userId: string) {
    // Calculate current weekly mission streak
    return {
      current: 2, // Placeholder
      longest: 8, // Placeholder
      isActiveThisWeek: true,
    };
  }

  private async calculateAverageMissionsPerDay(userId: string): Promise<number> {
    // Calculate average missions completed per day
    return 2.5; // Placeholder
  }

  private getStartOfDay(date: Date = new Date()): Date {
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);
    return start;
  }

  private getEndOfDay(date: Date = new Date()): Date {
    const end = new Date(date);
    end.setHours(23, 59, 59, 999);
    return end;
  }

  private getStartOfWeek(date: Date = new Date()): Date {
    const start = new Date(date);
    const day = start.getDay();
    const diff = start.getDate() - day;
    start.setDate(diff);
    start.setHours(0, 0, 0, 0);
    return start;
  }

  private getEndOfWeek(date: Date = new Date()): Date {
    const end = new Date(date);
    const day = end.getDay();
    const diff = end.getDate() + (6 - day);
    end.setDate(diff);
    end.setHours(23, 59, 59, 999);
    return end;
  }
}
