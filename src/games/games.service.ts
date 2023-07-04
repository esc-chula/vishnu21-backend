import { PrismaService } from '@/prisma/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GamesService {
  constructor(private prisma: PrismaService) {}

  getGames(expired: boolean) {
    if (expired) {
      return this.prisma.game.findMany({
        where: {
          expiresAt: {
            lte: new Date(),
          },
        },
      });
    } else {
      return this.prisma.game.findMany({
        where: {
          expiresAt: {
            gt: new Date(),
          },
        },
      });
    }
  }
}
