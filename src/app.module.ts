import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { GroupsModule } from './groups/groups.module';
import { ScoresModule } from './scores/scores.module';
import { AppController } from './app.controller';

@Module({
  imports: [PrismaModule, GroupsModule, ScoresModule],
})
export class AppModule {}