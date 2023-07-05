import { Body, Controller, Delete, Param, Patch, Post } from '@nestjs/common';
import { Roles } from '@prisma/client';
import { GamesService } from './games.service';
import { AllowRoles, PublicRoute } from '@/auth/auth.decorator';
import { GameDTO, updateGameDTO } from './games.dto';

@Controller('games')
export class GamesController {
  constructor(private gamesService: GamesService) {}

  @Post()
  @AllowRoles(Roles.Admin, Roles.IT, Roles.Activity)
  async createGame(@Body() body: GameDTO) {
    return await this.gamesService.createGame(body);
  }

  @Patch('/:id')
  @PublicRoute()
  // @AllowRoles(Roles.Admin, Roles.IT, Roles.Activity)
  async updateGame(@Param('id') id: string, @Body() body: updateGameDTO) {
    return await this.gamesService.updateGame(id, body);
  }

  @Delete('/:id')
  @PublicRoute()
  // @AllowRoles(Roles.Admin, Roles.IT, Roles.Activity)
  async deleteGame(@Param('id') id: string) {
    return await this.gamesService.deleteGame(id);
  }
}