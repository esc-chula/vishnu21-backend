import { GameType, ScoringMode } from '@prisma/client';
import { IsBoolean, IsDate, IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class GameDTO {
  @IsNotEmpty()
  name: string;
  @IsOptional()
  description?: string;
  @IsOptional()
  @IsInt()
  maxParticipant?: number;
  @IsOptional()
  @IsInt()
  maxScore?: number;
  @IsOptional()
  isIndividual?: boolean;
  @IsDate()
  expiresAt:  Date;
}

export class updateGameDTO {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  type?: GameType

  @IsOptional()
  scoring?: ScoringMode

  @IsOptional()
  @IsInt()
  maxParticipant?: number;

  @IsOptional()
  @IsInt()
  maxScore?: number;

  @IsOptional()
  @IsBoolean()
  isIndividual?: boolean;

  @IsOptional()
  @IsDate()
  expiresAt?:  Date;
}
