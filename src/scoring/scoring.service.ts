import { ForbiddenException, Injectable } from '@nestjs/common';
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

    async deleteScoreHistory(_oid: string) {
        // get scoreHistory by id 
        const scoreHistory = await this.prisma.scoreHistory.findUnique({
            where: {
                scoreId: _oid,
            },
            include: {
                Group: true,
            }
        })

        if(!scoreHistory || scoreHistory.scoreId !== _oid)
            throw new ForbiddenException('Access to resources denied');

        // delete scoreHistory
        await this.prisma.scoreHistory.delete({
            where: {
                scoreId: _oid,
            },
        });

        // reduce score of group
        await this.prisma.group.update({
            where: {
                groupId: scoreHistory.groupId,
            },
            data: {
                score: scoreHistory.Group.score - scoreHistory.score,
            }
        })

        return {
            "message": "Delete score history complete",
        }
    }
}