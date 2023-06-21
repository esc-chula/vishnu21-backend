import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Status } from '@prisma/client';

@Injectable()
export class UserService {
    constructor(private prisma: PrismaService) {}

    async createUser() {
        await this.prisma.user.create({
            data: {
                name: 'B',
                studentId: "2222222222",
                telNo: "2222222222",
                lineProfile: "222",
                status: Status.Intania106,
            },
        });

        await this.prisma.user.update({
            where: {
                studentId: "2222222222",
            },
            data: {
                Group: {
                    connect: {
                        groupId: "64929dfe3c5ef77807c733a6",
                    },
                },
            },
        })
    }
}