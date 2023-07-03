import { Body, Controller, Post } from '@nestjs/common';
import { Roles } from '@prisma/client';
import { GamesService } from './games.service';
import { AllowRoles } from '@/auth/auth.decorator';
import { GameDTO } from './games.dto';

@Controller('games')
export class GamesController {
  constructor(private gamesService: GamesService) {}

  @Post()
  @AllowRoles(Roles.Admin, Roles.IT, Roles.Activity)
  async createGame(@Body() body: GameDTO) {
    return await this.gamesService.createGame(body);
  }
}
