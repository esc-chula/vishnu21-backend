import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { GroupsModule } from './groups/groups.module';
import { ScoresModule } from './scores/scores.module';
import { AppController } from './app.controller';
import { PostsController } from './posts/posts.controller';
import { PostsModule } from './posts/posts.module';
import { CommentsController } from './comments/comments.controller';
import { CommentsService } from './comments/comments.service';
import { CommentsModule } from './comments/comments.module';
import { AuthModule } from './auth/auth.module';
import { AuthService } from './auth/auth.service';

@Module({
  imports: [
    PrismaModule,
    GroupsModule,
    AuthModule,
    UserModule,
    ScoresModule,
    PostsModule,
    CommentsModule,
    ,
    UserService,
  ],
})
export class AppModule {}
