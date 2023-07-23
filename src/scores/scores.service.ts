import {
  ForbiddenException,
  Injectable,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { ScoresHistoryDTO } from './types/scores.dto';

@Injectable()
export class ScoresService {
  constructor(private prisma: PrismaService) {}

  //@Get
  async getScores() {
    const result = {
      scores: [],
      updatedAt: null,
    };

    await this.prisma.group.findMany().then((groups) => {
      groups.forEach((group, index) => {
        result.scores.push({
          name: group.groupId,
          shortName: group.shortName,
          score: group.score || 0,
        });
        if (index == 0) result.updatedAt = group.updatedAt;
        if (group.updatedAt > result.updatedAt)
          result.updatedAt = group.updatedAt;
      });
    });
    result.scores.sort((a, b) => b.score - a.score);
    if (!result.updatedAt) result.updatedAt = new Date();
    return result;
  }

  async getScoreByHouseId(groupId: string) {
    let result = {
      groupId: null,
      score: 0,
      shortName: '',
      details: [],
      updatedAt: null,
    };

    try {
      await this.prisma.group
        .findFirstOrThrow({
          where: {
            groupId,
          },
          include: {
            ScoreHistory: {
              orderBy: {
                createdAt: 'desc',
              },
            },
          },
        })
        .then((group) => {
          result = {
            ...result,
            groupId: group.groupId,
            shortName: group.shortName,
            score: group.score || 0,
          };
          group.ScoreHistory.forEach((scoreHistory, index) => {
            result.details.push({
              id: scoreHistory.scoreId,
              info: scoreHistory.info,
              score: scoreHistory.score || 0,
              createdAt: scoreHistory.createdAt,
            });
            if (scoreHistory.createdAt > result.updatedAt)
              result.updatedAt = scoreHistory.createdAt;
            if (index == 0) result.updatedAt = scoreHistory.createdAt;
          });
        });
    } catch (error) {
      throw new BadRequestException(error.message);
    }

    return result;
  }

  //@Post
  async createScoreHistory(
    scoreHistoryDTO: ScoresHistoryDTO,
  ): Promise<{ scoreId: string; createdAt: Date }> {
    const group = await this.prisma.group.findUnique({
      where: {
        groupId: scoreHistoryDTO.groupId,
      },
      include: {
        ScoreHistory: true,
      },
    });

    if (!group) {
      throw new ForbiddenException('Group not found');
    }

    const newScoreHistory = await this.prisma.scoreHistory.create({
      data: scoreHistoryDTO,
    });

    await this.updateScoreChange(scoreHistoryDTO.groupId);

    return {
      scoreId: newScoreHistory.groupId,
      createdAt: newScoreHistory.createdAt,
    };
  }

  //@Patch
  async updateScores(
    id: string,
    payload: ScoresHistoryDTO,
  ): Promise<{
    scoreId: string;
    createdAt: Date;
    updatedAt: Date;
  }> {
    const scores = await this.prisma.scoreHistory.update({
      where: {
        scoreId: id,
      },
      data: { ...payload },
    });
    await this.updateScoreChange(scores.groupId);
    return {
      scoreId: scores.scoreId,
      createdAt: scores.createdAt,
      updatedAt: scores.updatedAt,
    };
  }

  //@Delete
  async deleteScoreHistory(_oid: string) {
    // get scoreHistory by id
    const scoreHistory = await this.prisma.scoreHistory.findUnique({
      where: {
        scoreId: _oid,
      },
      include: {
        Group: true,
      },
    });

    if (!scoreHistory || scoreHistory.scoreId !== _oid)
      throw new ForbiddenException('Access to resources denied');

    // delete scoreHistory
    await this.prisma.scoreHistory.delete({
      where: {
        scoreId: _oid,
      },
    });

    // I try this method, hope it works better munk
    await this.updateScoreChange(scoreHistory.groupId);
    return { message: 'Delete score history complete' };
  }

  // helping function
  async updateScoreChange(groupId: string) {
    const totalScore = await this.prisma.scoreHistory.aggregate({
      where: { groupId },
      _sum: {
        score: true,
      },
    });

    if (totalScore._sum.score === null) {
      await this.prisma.group.update({
        where: { groupId },
        data: { score: 0 },
      });
    } else {
      await this.prisma.group.update({
        where: { groupId },
        data: { score: totalScore._sum.score },
      });
    }
  }
}
