import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class GamePlayService {
    constructor(private prisma: PrismaService) {}

    async createGamePlay() {
        await this.prisma.gamePlay.create({
            data: {
                game: {
                    connect: {
                        gameId: "64929f3fe61c321dcb8965c4",
                    },
                },
                user: {
                    connect: {
                        userId: "64929fe06cfd38d69dbdeb3e",
                    },
                },
                score: 10,
            },
        });
    }
}
