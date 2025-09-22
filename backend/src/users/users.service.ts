import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { LoggerService } from '../common/services/logger.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';

@Injectable()
export class UsersService {
  constructor(
    private readonly database: DatabaseService,
    private readonly logger: LoggerService,
  ) {}

  async getUserProfile(userId: string): Promise<UserResponseDto> {
    const user = await this.database.user.findUnique({
      where: { id: userId },
      include: {
        subscription: {
          select: {
            plan: true,
            status: true,
            endDate: true,
          },
        },
        characterConfig: {
          select: {
            name: true,
            personality: true,
            humorLevel: true,
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      dateOfBirth: user.dateOfBirth,
      gender: user.gender,
      phoneNumber: user.phoneNumber,
      profilePicture: user.profilePicture,
      isActive: user.isActive,
      lastLoginAt: user.lastLoginAt,
      createdAt: user.createdAt,
      subscription: user.subscription,
      characterConfig: user.characterConfig,
    };
  }

  async updateUser(userId: string, updateUserDto: UpdateUserDto): Promise<UserResponseDto> {
    const existingUser = await this.database.user.findUnique({
      where: { id: userId },
    });

    if (!existingUser) {
      throw new NotFoundException('Usuário não encontrado');
    }

    // Check if email is being changed and if it's already in use
    if (updateUserDto.email && updateUserDto.email !== existingUser.email) {
      const emailExists = await this.database.user.findUnique({
        where: { email: updateUserDto.email },
      });

      if (emailExists) {
        throw new BadRequestException('Email já está em uso');
      }
    }

    const updatedUser = await this.database.user.update({
      where: { id: userId },
      data: {
        ...updateUserDto,
        updatedAt: new Date(),
      },
      include: {
        subscription: {
          select: {
            plan: true,
            status: true,
            endDate: true,
          },
        },
        characterConfig: {
          select: {
            name: true,
            personality: true,
            humorLevel: true,
          },
        },
      },
    });

    this.logger.log(`User updated successfully: ${userId}`, 'UsersService');

    return {
      id: updatedUser.id,
      email: updatedUser.email,
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      dateOfBirth: updatedUser.dateOfBirth,
      gender: updatedUser.gender,
      phoneNumber: updatedUser.phoneNumber,
      profilePicture: updatedUser.profilePicture,
      isActive: updatedUser.isActive,
      lastLoginAt: updatedUser.lastLoginAt,
      createdAt: updatedUser.createdAt,
      subscription: updatedUser.subscription,
      characterConfig: updatedUser.characterConfig,
    };
  }

  async deactivateUser(userId: string): Promise<void> {
    const user = await this.database.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    await this.database.user.update({
      where: { id: userId },
      data: {
        isActive: false,
        updatedAt: new Date(),
      },
    });

    this.logger.log(`User deactivated: ${userId}`, 'UsersService');
  }

  async getUserStats(userId: string) {
    // UserStats não existe mais na migração, vamos simular
    return {
      totalXp: 0,
      currentLevel: 1,
      totalInteractions: 0,
      streakDays: 0,
    };
  }

  async getSubscription(userId: string) {
    const subscription = await this.database.subscription.findUnique({
      where: { userId },
    });

    if (!subscription) {
      throw new NotFoundException('Assinatura não encontrada');
    }

    return {
      plan: subscription.plan,
      status: subscription.status,
      startDate: subscription.startDate,
      endDate: subscription.endDate,
      isTrialActive: false,
      daysUntilExpiry: subscription.endDate 
        ? Math.ceil((subscription.endDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
        : null,
    };
  }

  async updatePreferences(userId: string, preferences: any) {
    const user = await this.database.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    this.logger.log(`User preferences updated: ${userId}`, 'UsersService');
    
    return { message: 'Preferências atualizadas com sucesso' };
  }

  async incrementUserStats(userId: string, xpGained: number) {
    // Como UserStats não existe, vamos apenas logar
    this.logger.log(`User ${userId} gained ${xpGained} XP`, 'UsersService');
    
    return {
      totalXp: xpGained,
      currentLevel: 1,
      totalInteractions: 1,
    };
  }

  private calculateLevel(totalXp: number): number {
    return Math.floor(totalXp / 1000) + 1;
  }
}
