import {
  Body,
  Controller,
  Get,
  Delete,
  Param,
  Patch,
  Post,
  Req,
} from '@nestjs/common';
import { Roles } from '@prisma/client';
import { GamesService } from './games.service';
import { AllRoles, AllowRoles } from '@/auth/auth.decorator';
import { GameDTO, GameSubmitDTO, updateGameDTO } from './games.dto';

@Controller('games')
export class GamesController {
  constructor(private gamesService: GamesService) {}

  @AllRoles()
  @Get()
  getGames(@Req() req: any) {
    return this.gamesService.getGames(req.user.userId);
  }

  @Get(':id')
  @AllowRoles(Roles.Admin, Roles.IT, Roles.Activity, 'Board', 'PR')
  getGameByID(@Param('id') gameId: string) {
    return this.gamesService.getGameById(gameId);
  }

  @Get('play/:id')
  @AllRoles()
  getGameToPlay(@Param('id') gameId: string) {
    return this.gamesService.getGameToPlay(gameId);
  }

  @Post()
  @AllowRoles(Roles.Admin, Roles.IT, Roles.Activity, 'Board', 'PR')
  async createGame(@Body() body: GameDTO) {
    return await this.gamesService.createGame(body);
  }

  @Post('submit')
  @AllRoles()
  async submitGame(@Body() body: GameSubmitDTO, @Req() req: any) {
    return await this.gamesService.submitGame(req.user.userId, body);
  }

  @Patch(':id')
  @AllowRoles(Roles.Admin, Roles.IT, Roles.Activity, 'Board', 'PR')
  async updateGame(@Param('id') id: string, @Body() body: updateGameDTO) {
    return await this.gamesService.updateGame(id, body);
  }

  @Delete(':id')
  @AllowRoles(Roles.Admin, Roles.IT, Roles.Activity, 'Board', 'PR')
  async deleteGame(@Param('id') id: string) {
    return await this.gamesService.deleteGame(id);
  }
}
