import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class GroupService {
    constructor(private prisma: PrismaService) {}

    async createGroup() {
        await this.prisma.group.create({
            data: {
                houseName: "nameHouseC",
                group: "C",
                description: "testC",
                score: 0,
            },
        });
    }
}
