import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { GameType, ScoringMode } from '@prisma/client';

@Injectable()
export class GameService {
    constructor(private prisma: PrismaService) {}

    async createGame() {
        await this.prisma.game.create({
            data: {
                name: "GameA",
                description: "test",
                type: GameType.Choice,
                scoring: ScoringMode.Equal,
                maxParticipant: 10,
                maxScore: 10,
                isIndividual: false,
            },
        });
    }
}
