import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { GroupController } from './group/group.controller';
import { GroupModule } from './group/group.module';
import { ScoringModule } from './scoring/scoring.module';

@Module({
  imports: [PrismaModule, GroupModule, ScoringModule,],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
