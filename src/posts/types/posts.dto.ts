import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class PostsDTO {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsString()
  @IsNotEmpty()
  authorId: string;

  @IsOptional()
  @IsNotEmpty()
  groupId?: string;
}
