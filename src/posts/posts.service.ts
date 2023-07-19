import { BadRequestException, Injectable } from '@nestjs/common';
import { Post } from '@prisma/client';
import { PrismaService } from '@/prisma/prisma.service';
import { PostsDTO } from './types/posts.dto';

@Injectable()
export class PostsService {
  constructor(private prisma: PrismaService) {}

  async getPosts(): Promise<Post[]> {
    try {
      const posts = await this.prisma.post.findMany({
        orderBy: { updatedAt: 'desc' },
      });
      return posts;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  getPostsByGroup(groupId: string): Promise<Post[]> {
    return this.prisma.post.findMany({
      where: { OR: [{ isGlobal: true }, { groupId }] },
      include: { author: true, comments: true },
      orderBy: { updatedAt: 'desc' },
    });
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

  createPost(payload: PostsDTO, groupId?: string): Promise<Post> {
    try {
      const post = this.prisma.post.create({
        data: {
          ...payload,
          groupId: groupId ? groupId : payload.groupId,
          isGlobal: payload.groupId || groupId ? false : true,
        },
      });
      return post;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async createPostToGroup(payload: PostsDTO, groupName: string): Promise<Post> {
    try {
      const groupId = await this.prisma.group
        .findFirst({
          where: { group: groupName },
        })
        .then((group) => group.groupId);
      const post = this.prisma.post.create({
        data: {
          ...payload,
          groupId,
          isGlobal: false,
        },
      });
      return post;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  createPublicPost(payload: PostsDTO): Promise<Post> {
    try {
      const post = this.prisma.post.create({
        data: {
          ...payload,
          groupId: undefined,
          isGlobal: true,
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
