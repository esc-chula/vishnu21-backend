import { Controller, Post } from '@nestjs/common';
import { GamePlayService } from './group.service';

@Controller('gamePlay')
export class GamePlayController {
    constructor(private gamePlayService: GamePlayService) {}

    @Post()
    createGamePlay() {
        return this.gamePlayService.createGamePlay();
    }
}
