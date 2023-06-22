import { Injectable } from '@nestjs/common';
import { Post } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { PostsDTO } from './types/posts.dto';

@Injectable()
export class PostsService {
  constructor(private prisma: PrismaService) {}

  async getPosts(): Promise<Post[]> {
    const posts = await this.prisma.post.findMany();
    return posts;
  }

  async getPostById(id: string): Promise<Post> {
    const post = await this.prisma.post.findUnique({
      where: { postId: id },
    });
    return post;
  }

  createPost(payload: PostsDTO): Promise<Post> {
    // I think that authorId should be the id of the user that is logged in so wait for the auth module
    const post = this.prisma.post.create({
      data: {
        ...payload,
        isGlobal: payload.groupId ? false : true,
      },
    });
    return post;
  }

  updatePost(id: string, payload: PostsDTO): Promise<Post> {
    const post = this.prisma.post.update({
      where: { postId: id },
      data: {
        isGlobal: payload.groupId ? false : true,
        ...payload,
      },
    });
    return post;
  }

  deletePost(id: string): Promise<Post> {
    const post = this.prisma.post.delete({
      where: { postId: id },
    });
    return post;
  }
}
