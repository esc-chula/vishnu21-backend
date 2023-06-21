import { Module } from '@nestjs/common';
import { GamePlayController } from './group.controller';
import { GamePlayService } from './group.service';

@Module({
  controllers: [GamePlayController],
  providers: [GamePlayService]
})
export class GamePlayModule {}
