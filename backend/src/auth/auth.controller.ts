import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
  Get,
  Req,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ThrottlerGuard } from '@nestjs/throttler';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { GoogleAuthGuard } from './guards/google-auth.guard';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { LoggerService } from '../common/services/logger.service';

@ApiTags('auth')
@Controller('auth')
@UseGuards(ThrottlerGuard)
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly logger: LoggerService,
  ) {}

  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Criar nova conta de usuário' })
  @ApiResponse({
    status: 201,
    description: 'Usuário criado com sucesso',
    type: AuthResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Dados inválidos ou email já existe',
  })
  @ApiResponse({
    status: 429,
    description: 'Muitas tentativas. Tente novamente mais tarde.',
  })
  async signUp(@Body() signUpDto: SignUpDto): Promise<AuthResponseDto> {
    this.logger.log(`Sign up attempt for email: ${signUpDto.email}`, 'AuthController');
    
    const result = await this.authService.signUp(signUpDto);
    
    this.logger.log(`User created successfully: ${result.user.id}`, 'AuthController');
    return result;
  }

  @Post('signin')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Fazer login com email e senha' })
  @ApiResponse({
    status: 200,
    description: 'Login realizado com sucesso',
    type: AuthResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Credenciais inválidas',
  })
  @ApiResponse({
    status: 429,
    description: 'Muitas tentativas. Tente novamente mais tarde.',
  })
  async signIn(@Body() signInDto: SignInDto): Promise<AuthResponseDto> {
    this.logger.log(`Sign in attempt for email: ${signInDto.email}`, 'AuthController');
    
    const result = await this.authService.signIn(signInDto);
    
    this.logger.log(`User signed in successfully: ${result.user.id}`, 'AuthController');
    return result;
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Renovar token de acesso' })
  @ApiResponse({
    status: 200,
    description: 'Token renovado com sucesso',
    type: AuthResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Refresh token inválido',
  })
  async refreshToken(@Body() refreshTokenDto: RefreshTokenDto): Promise<AuthResponseDto> {
    return this.authService.refreshToken(refreshTokenDto.refreshToken);
  }

  @Get('google')
  @UseGuards(GoogleAuthGuard)
  @ApiOperation({ summary: 'Iniciar autenticação com Google' })
  @ApiResponse({
    status: 302,
    description: 'Redirecionamento para Google OAuth',
  })
  async googleAuth() {
    // Guard handles the redirect
  }

  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  @ApiOperation({ summary: 'Callback da autenticação Google' })
  @ApiResponse({
    status: 200,
    description: 'Autenticação Google realizada com sucesso',
    type: AuthResponseDto,
  })
  async googleAuthCallback(@Req() req): Promise<AuthResponseDto> {
    this.logger.log(`Google auth callback for user: ${req.user.email}`, 'AuthController');
    
    const result = await this.authService.socialLogin(req.user, 'GOOGLE');
    
    this.logger.log(`Google auth successful: ${result.user.id}`, 'AuthController');
    return result;
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Fazer logout (invalidar tokens)' })
  @ApiResponse({
    status: 200,
    description: 'Logout realizado com sucesso',
  })
  async logout(@Req() req): Promise<{ message: string }> {
    const userId = req.user.id;
    this.logger.log(`User logout: ${userId}`, 'AuthController');
    
    await this.authService.logout(userId);
    
    return { message: 'Logout realizado com sucesso' };
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obter dados do usuário autenticado' })
  @ApiResponse({
    status: 200,
    description: 'Dados do usuário',
  })
  async getMe(@Req() req) {
    return req.user;
  }
}
