import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsDTO } from './types/posts.dto';
import { AllowRoles } from '@/auth/auth.decorator';

@Controller('posts')
export class PostsController {
  constructor(private postsService: PostsService) {}

  @Get('/')
  getPosts() {
    return this.postsService.getPosts();
  }

  @Get('/group')
  getPostsByGroup(@Req() req: any) {
    return this.postsService.getPostsByGroup(req.user.groupId);
  }

  @Get('/:id')
  getPostsById(@Param('id') id: string) {
    return this.postsService.getPostById(id);
  }

  @Post('/')
  @AllowRoles('HeadHouse', 'Registration', 'Admin')
  createPost(@Body() payload: PostsDTO, @Req() req: any) {
    return this.postsService.createPost(
      {
        ...payload,
        authorId: req.user.userId,
      },
      req.user.groupId,
    );
  }

  @Post('/group/:groupName')
  @AllowRoles('Registration', 'Admin')
  createPostToGroup(
    @Body() payload: PostsDTO,
    @Param('groupName') groupName: string,
    @Req() req: any,
  ) {
    return this.postsService.createPostToGroup(
      {
        ...payload,
        authorId: req.user.userId,
      },
      groupName,
    );
  }

  @Post('/public')
  @AllowRoles('Registration', 'Admin')
  createPublicPost(
    @Body() payload: PostsDTO,
    @Param('groupName') groupName: string,
    @Req() req: any,
  ) {
    return this.postsService.createPublicPost({
      ...payload,
      authorId: req.user.userId,
    });
  }

  @Patch('/:id')
  @AllowRoles('HeadHouse', 'Registration', 'Admin')
  updatePost(@Param('id') id: string, @Body() payload: any) {
    return this.postsService.updatePost(id, payload);
  }

  @Delete('/:id')
  @AllowRoles('HeadHouse', 'Registration', 'Admin')
  deletePost(@Param('id') id: string) {
    return this.postsService.deletePost(id);
  }
}
