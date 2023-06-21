import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ScoringService {
    constructor(private prisma: PrismaService) {}

    async getScore() {
        const groups = await this.prisma.group.findMany()

        var result = {
            scores: [],
            updateAt: "5"
        };

        for (let i=0;i<groups.length;i++) {
            result.scores.push({
                "name": groups[i].houseName,
                "score": groups[i].score
            })
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
            updateAt: "5"
        };

        for (let i=0;i<group.scoreHistory.length;i++) {
            result.details.push({
                "info": group.scoreHistory[i].info,
                "score": group.scoreHistory[i].score,
                "createdAt": group.scoreHistory[i].createdAt,
            })
        }

        return result;
    }

    async createScoreHistory() {
        const body = {
            groupId : "64929dfe3c5ef77807c733a6",
            score : 10,
            info : "testtttt",
            description: "testttttt?"
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