import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsDTO } from './types/posts.dto';

@Controller('posts')
export class PostsController {
  constructor(private postsService: PostsService) {}

  @Get('/')
  getPosts() {
    return this.postsService.getPosts();
  }

  @Get('/:id')
  getPostsById(@Param('id') id: string) {
    return this.postsService.getPostById(id);
  }

  @Post('/')
  createPost(@Body() payload: PostsDTO) {
    return this.postsService.createPost(payload);
  }

  @Patch('/:id')
  updatePost(@Param('id') id: string, @Body() payload: any) {
    return this.postsService.updatePost(id, payload);
  }

  @Delete('/:id')
  deletePost(@Param('id') id: string) {
    return this.postsService.deletePost(id);
  }
}
