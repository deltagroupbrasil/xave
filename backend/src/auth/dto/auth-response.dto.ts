import { ApiProperty } from '@nestjs/swagger';

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
    description: 'Indica se o trial está ativo',
    example: true,
  })
  isTrialActive: boolean;
}

export class AuthResponseDto {
  @ApiProperty({
    description: 'Dados do usuário autenticado',
    type: UserResponseDto,
  })
  user: UserResponseDto;

  @ApiProperty({
    description: 'Token de acesso JWT',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  accessToken: string;

  @ApiProperty({
    description: 'Token para renovar o access token',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  refreshToken: string;
}
