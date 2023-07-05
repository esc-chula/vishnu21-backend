import { IsInt, IsOptional, IsString } from 'class-validator';

export class FaqDTO {
  @IsOptional()
  @IsString()
  event?: string;

  @IsOptional()
  @IsString()
  question?: string;

  @IsOptional()
  @IsString()
  answer?: string;

  @IsOptional()
  @IsInt()
  priority?: number;
}
