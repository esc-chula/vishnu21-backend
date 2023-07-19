import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { Prisma, Roles } from '@prisma/client';
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

  async findAll(page: number) {
    return this.prisma.user.findMany({ select: 100, skip: 100 * page });
  }

  async findByName(key: string, page: number) {
    return this.prisma.user.findFirst({
      where: {
        OR: [{ name: { contains: key } }, { nickname: { contains: key } }],
      },
      take: 100,
      skip: page * 100,
    });
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

  async validateUserRole(userId: string, includes?: Roles[], denied?: Roles[]) {
    const roles = await this.getUserRoles(userId);
    return (
      (denied || []).every((r) => !roles.roles.includes(r)) &&
      (!includes ? true : (includes || []).some((r) => roles.roles.includes(r)))
    );
  }

  async assignSSOTicket(studentId: string, ticketToken: string) {
    return await this.prisma.user.update({
      where: { studentId },
      data: { ticketToken },
    });
  }

  async updateUserProfile(userId: string, body: Prisma.UserUpdateInput) {
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
    if (!(user && user.lineAccessToken)) return null;
    return await this.httpService.axiosRef
      .get(
        `https://api.line.me/oauth2/v2.1/verify?access_token=${user.lineAccessToken}`,
      )
      .then(async () => {
        return await this.httpService.axiosRef
          .get('https://api.line.me/v2/profile', {
            headers: { Authorization: `Bearer ${user.lineAccessToken}` },
          })
          .then(async (res) => {
            return this.updateUserProfile(userId, {
              lineUsername: res.data.displayName,
              lineUserId: res.data.userId,
              profilePicture: res.data.pictureUrl,
            }).then((user) => {
              const { lineUsername, lineUserId, profilePicture } = user;
              return {
                username: lineUsername,
                userId: lineUserId,
                profilePicture,
              };
            });
          });
      })
      .catch((err) => {
        this.logger.error(`[getLineProfile] ${err}`);
        if (err.response) {
          this.logger.error(
            `[getLineProfile] ${JSON.stringify(err.response.data)}`,
          );
          if (this.refreshLineToken(userId)) return this.getLineProfile(userId);
          throw new BadRequestException('Invalid Line Access Token');
        }
      });
  }

  async refreshLineToken(userId: string) {
    const user = await this.findOne(userId);
    if (!(user && user.lineAccessToken)) return null;
    return await this.httpService.axiosRef
      .post(
        'https://api.line.me/oauth2/v2.1/token',
        new URLSearchParams({
          grant_type: 'refresh_token',
          client_id: this.configService.get('LINE_CHANNEL_CLIENT_ID'),
          client_secret: this.configService.get('LINE_CHANNEL_ACCESS_TOKEN'),
          refresh_token: user.lineAccessToken,
        }),
      )
      .then(async (res) => {
        this.updateUserProfile(userId, {
          lineAccessToken: res.data.access_token,
        });
        return true;
      })
      .catch((err) => {
        this.logger.error(`[refreshLineToken] ${err}`);
        if (err.response) {
          this.logger.error(
            `[refreshLineToken] ${JSON.stringify(err.response.data)}`,
          );
          this.updateUserProfile(userId, { lineAccessToken: null });
        }
        return false;
      });
  }
}
