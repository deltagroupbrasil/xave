import { ApiProperty } from '@nestjs/swagger';

export class SubscriptionResponseDto {
  @ApiProperty({
    description: 'Plano da assinatura',
    enum: ['FREE', 'BASIC', 'PREMIUM', 'VIP'],
    example: 'FREE',
  })
  plan: string;

  @ApiProperty({
    description: 'Status da assinatura',
    enum: ['ACTIVE', 'INACTIVE', 'CANCELLED', 'EXPIRED'],
    example: 'ACTIVE',
  })
  status: string;

  @ApiProperty({
    description: 'Data de expiração da assinatura',
    example: '2024-12-31T23:59:59Z',
    required: false,
  })
  endDate?: Date;
}

export class CharacterConfigResponseDto {
  @ApiProperty({
    description: 'Nome do personagem',
    example: 'Sofia',
  })
  name: string;

  @ApiProperty({
    description: 'Personalidade',
    example: 'friendly',
  })
  personality: string;

  @ApiProperty({
    description: 'Nível de humor (1-10)',
    example: 7,
    minimum: 1,
    maximum: 10,
  })
  humorLevel: number;
}

export class UserResponseDto {
  @ApiProperty({
    description: 'ID único do usuário',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'Email do usuário',
    example: 'usuario@exemplo.com',
  })
  email: string;

  @ApiProperty({
    description: 'Primeiro nome',
    example: 'João',
  })
  firstName: string;

  @ApiProperty({
    description: 'Último nome',
    example: 'Silva',
  })
  lastName: string;

  @ApiProperty({
    description: 'Data de nascimento',
    example: '1995-06-15T00:00:00Z',
    required: false,
  })
  dateOfBirth?: Date;

  @ApiProperty({
    description: 'Gênero do usuário',
    enum: ['MALE', 'FEMALE', 'NON_BINARY', 'PREFER_NOT_TO_SAY'],
    example: 'MALE',
    required: false,
  })
  gender?: string;

  @ApiProperty({
    description: 'Número de telefone',
    example: '+5511999999999',
    required: false,
  })
  phoneNumber?: string;

  @ApiProperty({
    description: 'URL da foto de perfil',
    example: 'https://exemplo.com/foto.jpg',
    required: false,
  })
  profilePicture?: string;

  @ApiProperty({
    description: 'Indica se o usuário está ativo',
    example: true,
  })
  isActive: boolean;

  @ApiProperty({
    description: 'Data do último login',
    example: '2024-01-10T14:30:00Z',
    required: false,
  })
  lastLoginAt?: Date;

  @ApiProperty({
    description: 'Data de criação da conta',
    example: '2024-01-01T10:00:00Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Dados da assinatura',
    type: SubscriptionResponseDto,
    required: false,
  })
  subscription?: SubscriptionResponseDto;

  @ApiProperty({
    description: 'Configuração do personagem',
    type: CharacterConfigResponseDto,
    required: false,
  })
  characterConfig?: CharacterConfigResponseDto;
}
