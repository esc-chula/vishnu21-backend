import { IsNotEmpty, IsString } from 'class-validator';

export class CommentsDTO {
  @IsNotEmpty()
  @IsString()
  @IsNotEmpty()
  content: string;

  @IsNotEmpty()
  @IsString()
  @IsNotEmpty()
  postId: string;

  @IsNotEmpty()
  @IsString()
  @IsNotEmpty()
  authorId: string;
}
