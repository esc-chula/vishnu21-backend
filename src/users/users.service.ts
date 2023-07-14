import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { Roles } from '@prisma/client';
import { PrismaService } from '@/prisma/prisma.service';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UsersService {
  private readonly logger: Logger;
  constructor(
    private prisma: PrismaService,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.logger = new Logger(UsersService.name);
  }

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
    return (
      roles.roles.every((r) => !denied?.includes(r)) &&
      roles.roles.some((r) => includes.includes(r))
    );
  }

  async assignSSOTicket(studentId: string, ticketToken: string) {
    return await this.prisma.user.update({
      where: { studentId },
      data: { ticketToken },
    });
  }

  async updateUserProfile(userId: string, body: any) {
    return await this.prisma.user.update({
      where: { userId },
      data: body,
    });
  }

  async updateUserProfileContact(userId: string, body: any) {
    return await this.prisma.user.update({
      where: { userId },
      data: body,
    });
  }

  async getUserProfile(userId: string) {
    return await this.prisma.user
      .findUnique({
        where: { userId },
      })
      .then(async (user) => {
        if (this.configService.get('LINE_CHANNEL_ACCESS_TOKEN'))
          return await this.httpService.axiosRef
            .get(`https://api.line.me/v2/bot/profile/${user.lineUserId}`, {
              headers: {
                Authorization: `Bearer ${this.configService.get(
                  'LINE_CHANNEL_ACCESS_TOKEN',
                )}`,
              },
            })
            .then(async (res) => {
              user.lineUsername = res.data.displayName;
              user.profilePicture = res.data.pictureUrl;
              await this.updateUserProfile(user.userId, {
                lineUsername: res.data.displayName,
                profilePicture: res.data.pictureUrl,
              });
              return user;
            })
            .catch((e) => {
              this.logger.error(e);
              return user;
            });
      });
  }
}
