import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CommentsDTO } from './types/comments.dto';

@Injectable()
export class CommentsService {
  constructor(private prisma: PrismaService) {}

  getComments() {
    try {
      const comments = this.prisma.comment.findMany();
      return comments;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  getCommentById(id: string) {
    try {
      const comment = this.prisma.comment.findUnique({
        where: { commentId: id },
      });
      return comment;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  createComment(payload: CommentsDTO) {
    // I think that authorId should be the id of the user that is logged in so wait for the auth module
    try {
      const comment = this.prisma.comment.create({
        data: {
          ...payload,
        },
      });
      return comment;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  updateComment(id: string, payload: CommentsDTO) {
    try {
      const comment = this.prisma.comment.update({
        where: { commentId: id },
        data: {
          ...payload,
        },
      });
      return comment;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  deleteComment(id: string) {
    try {
      const comment = this.prisma.comment.delete({
        where: { commentId: id },
      });
      return comment;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
