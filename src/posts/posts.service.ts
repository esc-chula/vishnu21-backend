import { BadRequestException, Injectable } from '@nestjs/common';
import { Post } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { PostsDTO } from './types/posts.dto';

@Injectable()
export class PostsService {
  constructor(private prisma: PrismaService) {}

  async getPosts(): Promise<Post[]> {
    try {
      const posts = await this.prisma.post.findMany();
      return posts;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getPostById(id: string): Promise<Post> {
    try {
      const post = await this.prisma.post.findUnique({
        where: { postId: id },
        include: {
          comments: true,
        },
      });
      return post;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  createPost(payload: PostsDTO): Promise<Post> {
    // I think that authorId should be the id of the user that is logged in so wait for the auth module
    try {
      const post = this.prisma.post.create({
        data: {
          ...payload,
          isGlobal: payload.groupId ? false : true,
        },
      });
      return post;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  updatePost(id: string, payload: PostsDTO): Promise<Post> {
    try {
      const post = this.prisma.post.update({
        where: { postId: id },
        data: {
          isGlobal: payload.groupId ? false : true,
          ...payload,
        },
      });
      return post;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  deletePost(id: string): Promise<Post> {
    try {
      const post = this.prisma.post.delete({
        where: { postId: id },
      });
      return post;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
