import { PrismaService } from '@/prisma/prisma.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import { Game, ScoringMode } from '@prisma/client';
import { GameDTO, GameSubmitDTO, updateGameDTO } from './games.dto';

@Injectable()
export class GamesService {
  constructor(private prisma: PrismaService) {}

  async getGameById(id: string) {
    return await this.prisma.game.findUnique({ where: { gameId: id } });
  }

  async getGameToPlay(id: string) {
    return await this.prisma.game.findUnique({
      where: { gameId: id },
      select: {
        title: true,
        description: true,
        choices: true,
        expiresAt: true,
        startedAt: true,
      },
    });
  }

  async getGames(userId: string) {
    return await this.prisma.game
      .findMany({
        select: {
          gameId: true,
          GamePlay: true,
          choices: false,
          description: true,
          expiresAt: true,
          hint: false,
          isIndividual: true,
          maxParticipant: true,
          maxScore: true,
          scoring: true,
          title: true,
          startedAt: true,
          createdAt: true,
        },
      })
      .then((games) => {
        return games.map((game) => {
          return {
            ...game,
            submitted:
              game.GamePlay.filter((play) => play.userId === userId).length > 0,
            GamePlay: undefined,
          };
        });
      });
  }

  async createGame(payload: GameDTO): Promise<Game> {
    const game = await this.prisma.game
      .create({
        data: {
          startedAt: new Date(),
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
    const group = await this.prisma.group.findFirst({
      where: { members: { some: { userId: userId } } },
      include: { members: true },
    });
    const game = await this.prisma.game
      .findUnique({
        where: {
          gameId: payload.gameId,
          expiresAt: { gt: new Date() },
          startedAt: { lt: new Date() },
        },
        include: { GamePlay: true },
      })
      .then((game) => game)
      .catch((error) => {
        console.error(error);
        throw new BadRequestException('ไม่เจอเกมที่เล่นได้ค้าบบ', error);
      });
    if (!game) throw new BadRequestException('ไม่เจอเกมที่เล่นได้ค้าบบ');
    if (
      game.GamePlay.filter(
        (gameplay) =>
          gameplay.userId === userId ||
          (!game.isIndividual &&
            group.members.filter((member) => member.userId === gameplay.userId)
              .length > 0),
      ).length > 0
    )
      throw new BadRequestException('ส่งซ้ำมาตะมัย T-T');
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
