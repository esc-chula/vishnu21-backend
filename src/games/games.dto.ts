import { GameType, ScoringMode } from '@prisma/client';
import { IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

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
}