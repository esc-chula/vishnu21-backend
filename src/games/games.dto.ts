import { ScoringMode } from '@prisma/client';
import {
  IsBoolean,
  IsDate,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class GameDTO {
  @IsNotEmpty()
  title: string;
  @IsOptional()
  description?: string;
  @IsNotEmpty()
  choices: { choiceId: string; text: string }[];
  @IsNotEmpty()
  hint: string;
  @IsOptional()
  scoring?: ScoringMode;
  @IsOptional()
  @IsInt()
  maxParticipant?: number;
  @IsOptional()
  @IsInt()
  maxScore?: number;
  @IsOptional()
  isIndividual?: boolean;
  @IsDate()
  expiresAt: Date;
  @IsDate()
  @IsOptional()
  startedAt: Date;
}

export class GameSubmitDTO {
  @IsNotEmpty()
  gameId: string;
  @IsNotEmpty()
  choiceId: string;
}

export class updateGameDTO {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNotEmpty()
  choices: { choiceId: string; text: string }[];

  @IsNotEmpty()
  hint: string;

  @IsOptional()
  scoring?: ScoringMode;

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
  expiresAt?: Date;
}
