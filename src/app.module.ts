import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { GroupsModule } from './groups/groups.module';
import { ScoresModule } from './scores/scores.module';
import { AppController } from './app.controller';
import { PostsController } from './posts/posts.controller';
import { PostsModule } from './posts/posts.module';

@Module({
  imports: [PrismaModule, GroupsModule, ScoresModule, PostsModule],
})
export class AppModule {}