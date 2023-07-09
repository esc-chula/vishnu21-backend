import { BadRequestException, Injectable } from '@nestjs/common';
import { Roles } from '@prisma/client';
import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findOneByStudentId(studentId: string) {
    return this.prisma.user.findUnique({ where: { studentId } });
  }
  async findOne(userId: string) {
    return this.prisma.user.findFirst({ where: { userId } });
  }

  async getUsers(): Promise<{
    [status: string]: [{ name: string; profile: string }];
  }> {
    const query = await this.prisma.user
      .aggregateRaw({
        pipeline: [
          {
            $group: {
              _id: '$status',
              data: {
                $push: {
                  name: '$name',
                  profile: { $ifNull: ['$lineProfile', ''] },
                },
              },
            },
          },
        ],
      })
      .catch((e) => {
        throw new BadRequestException(e.message);
      });

    const result = {};
    for (const item in query) {
      result[query[item]['_id']] = query[item]['data'];
    }

    return result;
  }

  async getUserRoles(userId: string) {
    return await this.prisma.user.findUnique({
      where: { userId },
      select: { studentId: true, roles: true },
    });
  }

  async validateUserRole(userId: string, includes: Roles[], denied?: Roles[]) {
    const roles = await this.getUserRoles(userId);
    console.log(roles);
    return roles.roles.some(
      (r) => includes.includes(r) && !denied?.includes(r),
    );
  }

  async assignSSOTicket(studentId: string, ticketToken: string) {
    return await this.prisma.user.update({
      where: { studentId },
      data: { ticketToken },
    });
  }

  async getUserProfile(userId: string) {
    return await this.prisma.user.findUnique({
      where: { userId },
      select: {
        userId: true,
        studentId: true,
        name: true,
        status: true,
        telNo: true,
        lineProfile: true,
        Group: true,
        roles: true,
      },
    });
  }
}
