import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsString,
  MinLength,
  MaxLength,
  IsDateString,
  IsEnum,
  IsOptional,
  Matches,
} from 'class-validator';
import { Gender } from '@prisma/client';

export class SignUpDto {
  @ApiProperty({
    description: 'Email do usuário',
    example: 'usuario@exemplo.com',
  })
  @IsEmail({}, { message: 'Email deve ter um formato válido' })
  email: string;

  @ApiProperty({
    description: 'Senha do usuário (mínimo 8 caracteres)',
    example: 'MinhaSenh@123',
    minLength: 8,
  })
  @IsString()
  @MinLength(8, { message: 'Senha deve ter pelo menos 8 caracteres' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, {
    message: 'Senha deve conter pelo menos: 1 letra minúscula, 1 maiúscula, 1 número e 1 caractere especial',
  })
  password: string;

  @ApiProperty({
    description: 'Primeiro nome',
    example: 'João',
    maxLength: 50,
  })
  @IsString()
  @MaxLength(50, { message: 'Primeiro nome deve ter no máximo 50 caracteres' })
  firstName: string;

  @ApiProperty({
    description: 'Último nome',
    example: 'Silva',
    maxLength: 50,
  })
  @IsString()
  @MaxLength(50, { message: 'Último nome deve ter no máximo 50 caracteres' })
  lastName: string;

  @ApiProperty({
    description: 'Data de nascimento (deve ter pelo menos 18 anos)',
    example: '1995-06-15',
  })
  @IsDateString({}, { message: 'Data de nascimento deve estar em formato válido (YYYY-MM-DD)' })
  dateOfBirth: string;

  @ApiProperty({
    description: 'Gênero do usuário',
    enum: Gender,
    example: Gender.MALE,
  })
  @IsEnum(Gender, { message: 'Gênero deve ser um valor válido' })
  gender: Gender;

  @ApiProperty({
    description: 'Número de telefone (opcional)',
    example: '+5511999999999',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Matches(/^\+[1-9]\d{1,14}$/, { message: 'Número de telefone deve estar em formato internacional válido' })
  phoneNumber?: string;
}
