import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ScoringService {
    constructor(private prisma: PrismaService) {}

    async getScore() {
        const result = {
            scores: [],
            updatedAt: null,
        };

        await this.prisma.group.findMany()
        .then(groups => {
            groups.forEach( (group, index) => {
                result.scores.push({
                    "name": group.houseName,
                    "score": group.score,
                })
                if(index == 0) result.updatedAt = group.updatedAt;
                if(group.updatedAt > result.updatedAt) result.updatedAt = group.updatedAt;
            })
        }) 
        return result;
    }

    async getScoreByHouseName(houseName: string) {
        let result = {
            name: null,
            score: null,
            details: [],
            updatedAt: null,
        };
 
        await this.prisma.group.findFirst({
            where: {
                houseName,
            },
            include: {
                scoreHistory: true,
            }
        }).then(group => {
            result = { ...result, name: group.houseName, score: group.score }
            group.scoreHistory.forEach( (scoreHistory, index) => {
                result.details.push({
                    "info": scoreHistory.info,
                    "score": scoreHistory.score,
                    "createdAt": scoreHistory.createdAt,
                })
                if(scoreHistory.createdAt > result.updatedAt) result.updatedAt = scoreHistory.createdAt;
                if(index == 0) result.updatedAt = scoreHistory.createdAt;
            })
        }).catch(() => {
            throw new ForbiddenException('This house name does not exist in Database.');
        })
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