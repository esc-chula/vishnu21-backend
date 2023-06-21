import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ScoringService {
    constructor(private prisma: PrismaService) {}

    async getScore() {
        const groups = await this.prisma.group.findMany();

        const result = {
            scores: [],
            updatedAt: null,
        };

        for (let i=0;i<groups.length;i++) {
            result.scores.push({
                "name": groups[i].houseName,
                "score": groups[i].score,
            })
            if(groups[i].updatedAt > result.updatedAt) result.updatedAt = groups[i].updatedAt;
            if(i == 0) result.updatedAt = groups[i].updatedAt;
        }

        return result;
    }

    async getScoreByHouseName(houseName: string) {
        const group = await this.prisma.group.findFirst({
            where: {
                houseName,
            },
            include: {
                scoreHistory: true,
            }
        })

        var result = {
            name: group.houseName,
            score: group.score,
            details: [],
            updatedAt: null,
        };

        for (let i=0;i<group.scoreHistory.length;i++) {
            result.details.push({
                "info": group.scoreHistory[i].info,
                "score": group.scoreHistory[i].score,
                "createdAt": group.scoreHistory[i].createdAt,
            })
            if(group.scoreHistory[i].createdAt > result.updatedAt) result.updatedAt = group.scoreHistory[i].createdAt;
            if(i == 0) result.updatedAt = group.scoreHistory[i].createdAt;
        }

        return result;
    }

    // Tese createScoreHistory
    async createScoreHistory() {
        const body = {
            groupId : "649306a9a0cbe65d1799af9e",
            score : 8,
            info : "test2",
            description: "testttttt2"
        }

        const group = await this.prisma.group.findFirst({
            where: {
                groupId: body.groupId,
            }
        })

        await this.prisma.scoreHistory.create({
            data: {
                Group: {
                    connect: {
                        groupId: body.groupId,
                    },
                },
                score : body.score,
                info : body.info,
                description: body.description,
            },
        });

        await this.prisma.group.update({
            where: {
                groupId: body.groupId,
            },
            data: {
                score: group.score+body.score,
            },
        })
    }
}