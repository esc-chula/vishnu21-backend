import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class FaqCreateDTO {
  @IsNotEmpty()
  @IsString()
  event: string;

  @IsNotEmpty()
  @IsString()
  question: string;

  @IsNotEmpty()
  @IsString()
  answer: string;

  @IsOptional()
  @IsInt()
  priority?: number;
}
