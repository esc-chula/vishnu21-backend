import { IsInt, IsNotEmpty, IsOptional } from 'class-validator';

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
