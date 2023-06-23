import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsDTO } from './types/comments.dto';

@Controller('comments')
export class CommentsController {
  constructor(private commentsService: CommentsService) {}

  @Get()
  getComments() {
    return this.commentsService.getComments();
  }

  @Get('/:id')
  getCommentById(@Param('id') id: string) {
    return this.commentsService.getCommentById(id);
  }

  @Post()
  createComment(@Body() payload: CommentsDTO) {
    return this.commentsService.createComment(payload);
  }

  @Patch('/:id')
  updateComment(@Param('id') id: string, @Body() payload: CommentsDTO) {
    return this.commentsService.updateComment(id, payload);
  }

  @Delete('/:id')
  deleteComment(@Param('id') id: string) {
    return this.commentsService.deleteComment(id);
  }
}
