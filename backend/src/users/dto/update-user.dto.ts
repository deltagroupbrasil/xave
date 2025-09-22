import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsString,
  MaxLength,
  IsOptional,
  IsDateString,
  IsEnum,
  Matches,
} from 'class-validator';
import { Gender } from '@prisma/client';

export class UpdateUserDto {
  @ApiProperty({
    description: 'Email do usuário',
    example: 'usuario@exemplo.com',
    required: false,
  })
  @IsOptional()
  @IsEmail({}, { message: 'Email deve ter um formato válido' })
  email?: string;

  @ApiProperty({
    description: 'Primeiro nome',
    example: 'João',
    maxLength: 50,
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(50, { message: 'Primeiro nome deve ter no máximo 50 caracteres' })
  firstName?: string;

  @ApiProperty({
    description: 'Último nome',
    example: 'Silva',
    maxLength: 50,
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(50, { message: 'Último nome deve ter no máximo 50 caracteres' })
  lastName?: string;

  @ApiProperty({
    description: 'Data de nascimento',
    example: '1995-06-15',
    required: false,
  })
  @IsOptional()
  @IsDateString({}, { message: 'Data de nascimento deve estar em formato válido (YYYY-MM-DD)' })
  dateOfBirth?: string;

  @ApiProperty({
    description: 'Gênero do usuário',
    enum: Gender,
    example: Gender.MALE,
    required: false,
  })
  @IsOptional()
  @IsEnum(Gender, { message: 'Gênero deve ser um valor válido' })
  gender?: Gender;

  @ApiProperty({
    description: 'Número de telefone',
    example: '+5511999999999',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Matches(/^\+[1-9]\d{1,14}$/, { message: 'Número de telefone deve estar em formato internacional válido' })
  phoneNumber?: string;

  @ApiProperty({
    description: 'URL da foto de perfil',
    example: 'https://exemplo.com/foto.jpg',
    required: false,
  })
  @IsOptional()
  @IsString()
  profilePicture?: string;
}
