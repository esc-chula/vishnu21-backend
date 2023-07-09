import { PrismaService } from '@/prisma/prisma.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import { Game } from '@prisma/client';
import { GameDTO, updateGameDTO } from './games.dto';

@Injectable()
export class GamesService {
  constructor(private prisma: PrismaService) {}

  async getGames(expired: boolean) {
    if (expired) {
      return await this.prisma.game.findMany({
        where: {
          expiresAt: {
            lte: new Date(),
          },
        },
      });
    } else {
      return await this.prisma.game.findMany({
        where: {
          expiresAt: {
            gt: new Date(),
          },
        },
      });
    }
  }

  async createGame(payload: GameDTO): Promise<Game> {
    const game = await this.prisma.game
      .create({
        data: {
          ...payload,
        },
      })
      .catch((error) => {
        throw new BadRequestException(error.message);
      });

    return game;
  }

  async updateGame(id: string, payload: updateGameDTO): Promise<Game> {
    try {
      return await this.prisma.game.update({
        where: { gameId: id },
        data: { ...payload },
      });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async deleteGame(id: string) {
    try {
      await this.prisma.game.delete({
        where: { gameId: id },
      });

      return { message: 'Delete game complete' };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
