import { Body, Controller, Get, Query } from '@nestjs/common';
import { GamesService } from './games.service';
import { AllRoles } from '@/auth/auth.decorator';
import { Roles } from '@prisma/client';
import { GameDTO } from './games.dto';


@Controller('games')
export class GamesController {
  constructor(private gamesService: GamesService) {}

  @AllRoles()
  @Get('/')
  getGames(@Query() query: { expired?: boolean }) {
    const { expired } = query;
    return this.gamesService.getGames(expired);

  @Post()
  @AllowRoles(Roles.Admin, Roles.IT, Roles.Activity)
  async createGame(@Body() body: GameDTO) {
    return await this.gamesService.createGame(body);
  }
}
