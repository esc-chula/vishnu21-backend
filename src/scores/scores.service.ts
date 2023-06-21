import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ScoresHistoryDTO } from './types/scores.dto';

@Injectable()
export class ScoresService {
  constructor(private prisma: PrismaService) {}

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
      data: {
        groupId: payload.groupId,
        score: payload.score,
        info: payload.info,
        description: payload.description,
      },
    });

    return {
      scoreId: scores.scoreId,
      createdAt: scores.createdAt,
      updatedAt: scores.updatedAt,
    };
  }
}
