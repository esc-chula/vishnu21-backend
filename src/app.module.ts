import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { GroupModule } from './group/group.module';
import { ScoresModule } from './scores/scores.module';
import { AppController } from './app.controller';

@Module({
  imports: [PrismaModule, GroupModule, ScoresModule],
})
export class AppModule {}
