import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) { }

    async getUsers(): Promise<{ [status: string]: Prisma.UserGetPayload<{}>[] }> {
        const query = await this.prisma.user.findMany({ include: { Group: true } })
            .catch((e) => { throw new BadRequestException(e.message) });

        const result = {};
        for (const user of query) {
            if (result[user.status]) {
                result[user.status].push(user);
            }
            else {
                result[user.status] = [user];
            }
        }

        return result;
    }

    // async getUsers(): Promise<{ [status: string]: Prisma.UserGetPayload<{}>[] }> {
    //     const query = await this.prisma.user.aggregateRaw({
    //         pipeline: [
    //             { $group: { _id: "$status", data: { $push: "$$ROOT" } } },
    //         ]
    //     }).catch((e) => { throw new BadRequestException(e.message) });

    //     // query structure: [{_id: status, data: [user, ...]}, {_id: "Intania106", data: [user1, user2, ...]}]

    //     const result = {};
    //     for (const i in query) {
    //         result[query[i]["_id"]] = query[i]["data"];
    //     }
    //     return result;
    // }


}

