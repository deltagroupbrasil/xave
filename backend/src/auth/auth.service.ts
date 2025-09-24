import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { DatabaseService } from '../database/database.service';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';
import { AuthResponseDto } from './dto/auth-response.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly database: DatabaseService,
    private readonly jwtService: JwtService,
  ) {}

  async signUp(signUpDto: SignUpDto): Promise<AuthResponseDto> {
    const { email, password, firstName, lastName, dateOfBirth, gender } = signUpDto;

    // Check if user already exists
    const existingUser = await this.database.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('Email já está em uso');
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12);

    // Create user with subscription and character config
    const user = await this.database.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          email,
          passwordHash,
          firstName,
          lastName,
          dateOfBirth: new Date(dateOfBirth),
          gender,
          authProvider: 'EMAIL',
          emailVerified: false,
        },
      });

      // Create free subscription
      await tx.subscription.create({
        data: {
          userId: newUser.id,
          plan: 'FREE' as const,
          status: 'ACTIVE',
        },
      });

      // Create default character config
      await tx.characterConfig.create({
        data: {
          userId: newUser.id,
          name: 'Sofia',
          personality: 'PLAYFUL',
          interests: ['música', 'cinema'],
        },
      });

      return newUser;
    });

    const tokens = await this.generateTokens(user.id, user.email);

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        isTrialActive: false,
      },
      ...tokens,
    };
  }

  async signIn(signInDto: SignInDto): Promise<AuthResponseDto> {
    const { email, password } = signInDto;

    const user = await this.database.user.findUnique({
      where: { email },
    });

    if (!user || !user.passwordHash) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    // Update last login
    await this.database.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    const tokens = await this.generateTokens(user.id, user.email);

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        isTrialActive: false,
      },
      ...tokens,
    };
  }

  async refreshToken(refreshToken: string): Promise<AuthResponseDto> {
    try {
      const payload = await this.jwtService.verifyAsync(refreshToken);
      const user = await this.database.user.findUnique({
        where: { id: payload.sub },
      });

      if (!user) {
        throw new UnauthorizedException('Usuário não encontrado');
      }

      const tokens = await this.generateTokens(user.id, user.email);

      return {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          isTrialActive: false,
        },
        ...tokens,
      };
    } catch (error) {
      throw new UnauthorizedException('Token inválido');
    }
  }

  async logout(userId: string): Promise<void> {
    // In a more complex setup, you might want to blacklist tokens
    // For now, we'll just log the logout
    console.log(`User ${userId} logged out`);
  }

  private async generateTokens(userId: string, email: string) {
    const payload = { sub: userId, email };
    
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, { expiresIn: '7d' }),
      this.jwtService.signAsync(payload, { expiresIn: '30d' }),
    ]);

    return { accessToken, refreshToken };
  }

  async validateUser(userId: string) {
    return await this.database.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        isActive: true,
      },
    });
  }

  async socialLogin(profile: any, provider: string): Promise<AuthResponseDto> {
    // Check if user exists
    let user = await this.database.user.findUnique({
      where: { email: profile.email },
    });

    if (!user) {
      // Create new user from social profile
      user = await this.database.user.create({
        data: {
          email: profile.email,
          firstName: profile.firstName || profile.name?.split(' ')[0] || '',
          lastName: profile.lastName || profile.name?.split(' ').slice(1).join(' ') || '',
          authProvider: provider as any,
          emailVerified: true,
          profilePicture: profile.picture,
        },
      });

      // Create default subscription and character config
      await this.database.subscription.create({
        data: {
          userId: user.id,
          plan: 'FREE' as const,
          status: 'ACTIVE',
        },
      });

      await this.database.characterConfig.create({
        data: {
          userId: user.id,
          name: 'Sofia',
          personality: 'PLAYFUL',
          interests: [],
        },
      });
    }

    const tokens = await this.generateTokens(user.id, user.email);

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        isTrialActive: false,
      },
      ...tokens,
    };
  }
}
