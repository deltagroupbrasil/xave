import {
  Controller,
  Get,
  Put,
  Body,
  Param,
  UseGuards,
  Req,
  HttpCode,
  HttpStatus,
  Delete,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { LoggerService } from '../common/services/logger.service';

@ApiTags('users')
@Controller('users')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly logger: LoggerService,
  ) {}

  @Get('me')
  @ApiOperation({ summary: 'Obter dados do usuário autenticado' })
  @ApiResponse({
    status: 200,
    description: 'Dados do usuário',
    type: UserResponseDto,
  })
  async getMe(@CurrentUser('id') userId: string): Promise<UserResponseDto> {
    this.logger.log(`Getting user profile: ${userId}`, 'UsersController');
    return this.usersService.getUserProfile(userId);
  }

  @Put('me')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Atualizar dados do usuário' })
  @ApiResponse({
    status: 200,
    description: 'Usuário atualizado com sucesso',
    type: UserResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Dados inválidos',
  })
  async updateMe(
    @CurrentUser('id') userId: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    this.logger.log(`Updating user profile: ${userId}`, 'UsersController');
    return this.usersService.updateUser(userId, updateUserDto);
  }

  @Delete('me')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Desativar conta do usuário' })
  @ApiResponse({
    status: 204,
    description: 'Conta desativada com sucesso',
  })
  async deactivateAccount(@CurrentUser('id') userId: string): Promise<void> {
    this.logger.log(`Deactivating user account: ${userId}`, 'UsersController');
    await this.usersService.deactivateUser(userId);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Obter estatísticas do usuário' })
  @ApiResponse({
    status: 200,
    description: 'Estatísticas do usuário',
  })
  async getUserStats(@CurrentUser('id') userId: string) {
    this.logger.log(`Getting user stats: ${userId}`, 'UsersController');
    return this.usersService.getUserStats(userId);
  }

  @Get('subscription')
  @ApiOperation({ summary: 'Obter dados da assinatura' })
  @ApiResponse({
    status: 200,
    description: 'Dados da assinatura',
  })
  async getSubscription(@CurrentUser('id') userId: string) {
    this.logger.log(`Getting user subscription: ${userId}`, 'UsersController');
    return this.usersService.getSubscription(userId);
  }

  @Put('preferences')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Atualizar preferências do usuário' })
  @ApiResponse({
    status: 200,
    description: 'Preferências atualizadas com sucesso',
  })
  async updatePreferences(
    @CurrentUser('id') userId: string,
    @Body() preferences: any,
  ) {
    this.logger.log(`Updating user preferences: ${userId}`, 'UsersController');
    return this.usersService.updatePreferences(userId, preferences);
  }
}
