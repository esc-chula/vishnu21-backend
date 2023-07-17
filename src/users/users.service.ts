import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { Roles, User } from '@prisma/client';
import { PrismaService } from '@/prisma/prisma.service';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { URLSearchParams } from 'url';

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

  async updateUserProfile(userId: string, body: Partial<User>) {
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
      .then((user) => {
        this.getLineProfile(userId);
        return user;
      });
  }

  async getLineProfile(userId: string) {
    const user = await this.findOne(userId);
    if (!user || !user.lineIdToken) return null;
    return await this.httpService.axiosRef
      .post(
        `https://api.line.me/oauth2/v2.1/verify`,
        new URLSearchParams({
          id_token: user.lineIdToken,
          client_id: this.configService.get('LINE_CHANNEL_CLIENT_ID'),
        }),
        {
          headers: { 'content-type': 'application/x-www-form-urlencoded' },
        },
      )
      .then((res) => {
        return this.updateUserProfile(userId, {
          lineUsername: res.data.name,
          lineUserId: res.data.sub,
          profilePicture: res.data.picture,
        }).then((user) => {
          const { lineUsername, lineUserId, profilePicture } = user;
          return { username: lineUsername, userId: lineUserId, profilePicture };
        });
      })
      .catch((err) => {
        this.logger.error(err);
        console.error(err);
        throw err;
      });
  }
}
