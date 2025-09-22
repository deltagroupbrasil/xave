import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { LoggerService } from '../common/services/logger.service';

@Injectable()
export class GamificationService {
  constructor(
    private readonly database: DatabaseService,
    private readonly logger: LoggerService,
  ) {}

  async getUserAchievements(userId: string) {
    const achievements = await this.database.userAchievement.findMany({
      where: { userId },
      include: {
        achievement: true,
      },
    });

    return achievements.map(ua => ({
      id: ua.achievement.id,
      name: ua.achievement.name,
      description: ua.achievement.description,
      icon: ua.achievement.icon,
      xpReward: ua.achievement.xpReward,
      progress: 100, // Mock progress
      isCompleted: true, // Mock completion
      completedAt: new Date(),
    }));
  }

  async getUserGamificationProfile(userId: string) {
    const stats = await this.getUserStats(userId);
    const achievements = await this.getUserAchievements(userId);
    const missions = await this.getUserMissions(userId);

    return {
      stats,
      achievements,
      missions,
      level: stats.currentLevel,
      xp: stats.totalXp,
      nextLevelXp: stats.currentLevel * 1000,
    };
  }

  async claimAchievement(userId: string, achievementId: string) {
    return this.awardAchievement(userId, achievementId);
  }

  async getDailyMissions(userId: string) {
    const missions = await this.database.userMission.findMany({
      where: { 
        userId,
        mission: { type: 'DAILY' }
      },
      include: { mission: true },
    });

    return missions.map(um => ({
      id: um.mission.id,
      title: um.mission.title,
      description: um.mission.description,
      xpReward: um.mission.xpReward,
      status: um.status,
      progress: um.progress,
    }));
  }

  async getWeeklyMissions(userId: string) {
    const missions = await this.database.userMission.findMany({
      where: { 
        userId,
        mission: { type: 'WEEKLY' }
      },
      include: { mission: true },
    });

    return missions.map(um => ({
      id: um.mission.id,
      title: um.mission.title,
      description: um.mission.description,
      xpReward: um.mission.xpReward,
      status: um.status,
      progress: um.progress,
    }));
  }

  async completeMission(userId: string, missionId: string) {
    const userMission = await this.database.userMission.findUnique({
      where: {
        userId_missionId: { userId, missionId }
      },
      include: { mission: true }
    });

    if (!userMission) {
      throw new NotFoundException('Mission not found');
    }

    const updated = await this.database.userMission.update({
      where: { id: userMission.id },
      data: {
        status: 'COMPLETED',
        progress: 100,
        completedAt: new Date(),
      },
    });

    return updated;
  }

  async getLevelProgress(userId: string) {
    const stats = await this.getUserStats(userId);
    const currentLevelXp = (stats.currentLevel - 1) * 1000;
    const nextLevelXp = stats.currentLevel * 1000;
    const progressXp = stats.totalXp - currentLevelXp;

    return {
      currentLevel: stats.currentLevel,
      currentXp: stats.totalXp,
      progressXp,
      nextLevelXp,
      progressPercentage: Math.round((progressXp / 1000) * 100),
    };
  }

  async getStreakInfo(userId: string) {
    return {
      currentStreak: 5, // Mock
      longestStreak: 12, // Mock
      lastActivityDate: new Date(),
      streakType: 'daily',
    };
  }

  async getUserSkills(userId: string) {
    const stats = await this.getUserStats(userId);
    return stats.skills;
  }

  async getUserMissions(userId: string) {
    const missions = await this.database.userMission.findMany({
      where: { userId },
      include: {
        mission: true,
      },
    });

    return missions.map(um => ({
      id: um.mission.id,
      title: um.mission.title,
      description: um.mission.description,
      type: um.mission.type,
      difficulty: um.mission.difficulty,
      xpReward: um.mission.xpReward,
      status: um.status,
      progress: um.progress,
      startedAt: um.startedAt,
      completedAt: um.completedAt,
    }));
  }

  async getLeaderboard(limit: number = 10) {
    // Como UserStats não existe, vamos simular um leaderboard
    const users = await this.database.user.findMany({
      take: limit,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        profilePicture: true,
      },
    });

    return users.map((user, index) => ({
      rank: index + 1,
      id: user.id,
      name: `${user.firstName} ${user.lastName}`,
      profilePicture: user.profilePicture,
      totalXp: Math.floor(Math.random() * 10000), // Mock XP
      level: Math.floor(Math.random() * 20) + 1, // Mock level
    }));
  }

  async getUserStats(userId: string) {
    // Mock user stats since UserStats table doesn't exist
    return {
      totalXp: 0,
      currentLevel: 1,
      totalInteractions: 0,
      streakDays: 0,
      lastActiveDate: new Date(),
      skills: {
        humor: 0,
        originalidade: 0,
        empatia: 0,
        estilo: 0,
        criatividade: 0,
        confianca: 0,
      },
    };
  }

  async updateUserStreak(userId: string, newStreak: number) {
    this.logger.log(`Updating streak for user ${userId}: ${newStreak}`, 'GamificationService');
    
    // Mock streak update since UserStats doesn't exist
    return {
      streakDays: newStreak,
      totalXp: newStreak * 10,
      currentLevel: Math.floor(newStreak / 7) + 1,
    };
  }

  async awardAchievement(userId: string, achievementId: string) {
    const existingAward = await this.database.userAchievement.findUnique({
      where: {
        userId_achievementId: {
          userId,
          achievementId,
        },
      },
    });

    if (existingAward) {
      return existingAward;
    }

    const achievement = await this.database.achievement.findUnique({
      where: { id: achievementId },
    });

    if (!achievement) {
      throw new NotFoundException('Achievement not found');
    }

    const userAchievement = await this.database.userAchievement.create({
      data: {
        userId,
        achievementId,
      },
      include: {
        achievement: true,
      },
    });

    this.logger.log(`Achievement awarded: ${achievement.name} to user ${userId}`, 'GamificationService');

    return userAchievement;
  }

  async checkAchievements(userId: string, interactionCount: number, score: number) {
    const achievements = await this.database.achievement.findMany({
      where: { isActive: true },
    });

    const awardedAchievements = [];

    for (const achievement of achievements) {
      const requirement = achievement.requirement as any;
      
      let shouldAward = false;

      if (achievement.type === 'INTERACTION_COUNT' && requirement.interactions) {
        shouldAward = interactionCount >= requirement.interactions;
      } else if (achievement.type === 'SKILL_LEVEL' && requirement.minScore) {
        shouldAward = score >= requirement.minScore;
      }

      if (shouldAward) {
        try {
          const awarded = await this.awardAchievement(userId, achievement.id);
          awardedAchievements.push(awarded);
        } catch (error) {
          // Achievement already awarded or other error
        }
      }
    }

    return awardedAchievements;
  }
}
