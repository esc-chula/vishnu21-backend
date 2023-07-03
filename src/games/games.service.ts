import { PrismaService } from '@/prisma/prisma.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import { Game } from '@prisma/client';
import { GameDTO } from './games.dto';

@Injectable()
export class GamesService {
  constructor(private prisma: PrismaService) {}

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
}
