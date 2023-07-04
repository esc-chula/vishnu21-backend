import { Controller, Get, Query } from '@nestjs/common';
import { GamesService } from './games.service';
import { AllRoles } from '@/auth/auth.decorator';

@Controller('games')
export class GamesController {
  constructor(private gamesService: GamesService) {}

  @AllRoles()
  @Get('/')
  getGames(@Query() query: { expired?: boolean }) {
    const { expired } = query;
    return this.gamesService.getGames(expired);
  }
}
