import { PrismaService } from '@/prisma/prisma.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import { Game, ScoringMode } from '@prisma/client';
import { GameDTO, GameSubmitDTO, updateGameDTO } from './games.dto';

@Injectable()
export class GamesService {
  constructor(private prisma: PrismaService) {}

  async getGames(userId: string, all?: boolean) {
    return await this.prisma.game.findMany({
      where: all ? {} : { NOT: { GamePlay: { some: { userId } } } },
      select: {
        gameId: true,
        GamePlay: false,
        choices: true,
        description: true,
        expiresAt: true,
        hint: false,
        isIndividual: true,
        maxParticipant: true,
        maxScore: true,
        scoring: true,
        title: true,
        createdAt: true,
      },
    });
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

  scoreCounter(
    maxScore: number,
    previousParticipant: number,
    maxParticipant: number,
    mode: ScoringMode,
  ) {
    switch (mode) {
      case 'Linear':
        return maxScore - (maxScore / maxParticipant) * previousParticipant;
      case 'Equal':
        return maxScore;
      case 'Exponential':
        return (
          maxScore -
          (Math.pow(maxScore, 2) / Math.pow(maxParticipant, 2)) *
            Math.pow(previousParticipant, 2)
        );
      case 'FirstBlood':
        return previousParticipant < maxParticipant ? maxScore : 0;
      case 'Logarithmic':
        return (
          maxScore -
          (Math.log(maxParticipant) / Math.log(previousParticipant)) * maxScore
        );
    }
  }

  async submitGame(userId: string, payload: GameSubmitDTO) {
    const game = await this.prisma.game
      .findUnique({
        where: { gameId: payload.gameId },
        include: { GamePlay: true },
      })
      .then((game) => game)
      .catch((error) => {
        console.error(error);
        throw new BadRequestException('Game not found', error);
      });
    if (
      game.GamePlay.filter((gameplay) => gameplay.userId === userId).length > 0
    )
      throw new BadRequestException('You already submit this game');
    if (!game) throw new BadRequestException('Game not found');
    const score =
      payload.choiceId === game.hint
        ? this.scoreCounter(
            game.maxScore || 1,
            game.GamePlay.filter((play) => play.score).length,
            game.maxParticipant,
            game.scoring,
          )
        : 0;
    return await this.prisma.gamePlay
      .create({
        data: {
          gameId: game.gameId,
          userId: userId,
          score: score,
          choiceId: payload.choiceId,
        },
      })
      .catch((error) => {
        throw new BadRequestException(error.message);
      });
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
