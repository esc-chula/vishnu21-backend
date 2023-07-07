import { Body, Controller, Get, Delete, Param, Patch, Post, Query } from '@nestjs/common';
import { Roles } from '@prisma/client';
import { GamesService } from './games.service';
import { AllRoles, AllowRoles } from '@/auth/auth.decorator';
import { GameDTO, updateGameDTO } from './games.dto';

@Controller('games')
export class GamesController {
  constructor(private gamesService: GamesService) {}

  @AllRoles()
  @Get('/')
  getGames(@Query() query: { expired?: boolean }) {
    const { expired } = query;
    return this.gamesService.getGames(expired);
  }
  
  @Post()
  @AllowRoles(Roles.Admin, Roles.IT, Roles.Activity)
  async createGame(@Body() body: GameDTO) {
    return await this.gamesService.createGame(body);
  }

  @Patch('/:id')
  @AllowRoles(Roles.Admin, Roles.IT, Roles.Activity)
  async updateGame(@Param('id') id: string, @Body() body: updateGameDTO) {
    return await this.gamesService.updateGame(id, body);
  }

  @Delete('/:id')
  @AllowRoles(Roles.Admin, Roles.IT, Roles.Activity)
  async deleteGame(@Param('id') id: string) {
    return await this.gamesService.deleteGame(id);
  }
}
