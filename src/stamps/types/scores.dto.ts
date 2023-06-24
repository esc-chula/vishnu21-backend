import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class ScoresHistoryDTO {
  @IsString()
  @IsNotEmpty()
  groupId: string;

  @IsInt()
  @IsNotEmpty()
  score: number;

  @IsString()
  @IsNotEmpty()
  info: string;

  @IsOptional()
  @IsString()
  description?: string;
}
