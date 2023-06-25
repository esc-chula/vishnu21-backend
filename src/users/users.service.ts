import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) { }

    async getUsers(): Promise<{ [status: string]: [{name: string, profile: string}] }> {
        const query = await this.prisma.user.aggregateRaw({
            pipeline: [
                { $group: { _id: "$status", data: { $push: {name: "$name", profile: "$lineProfile"} } },
                  },

            ]
        }).catch((e) => { throw new BadRequestException(e.message) });

        const result = {};
        for (const item in query) {
            result[query[item]["_id"]] = query[item]["data"];
        }

        return result;
    }

}

