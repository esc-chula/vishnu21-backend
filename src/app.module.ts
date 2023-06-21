import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { ScoringModule } from './scoring/scoring.module';
import { GroupModule } from './group/group.module';
import { GameModule } from './game/game.module';
import { GamePlayModule } from './gamePlay/group.module';

@Module({
  imports: [
    UserModule, 
    GroupModule,
    GameModule,
    GamePlayModule,
    ScoringModule,
    PrismaModule, 
  ],
})
export class AppModule {}
