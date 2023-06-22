import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async verifyAccessToken(accessToken: string): Promise<any> {
    const response = await axios.get(
      `https://api.line.me/oauth2/v2.1/verify?access_token=${accessToken}`,
    );

    const { data } = response;

    // ASK: Do we need configService?
    // if (data.client_id !== this.configService.get('LINE_CHANNEL_ID')) {
    if (data.client_id !== process.env.LINE_CHANNEL_ID) {
      throw new Error('Invalid access token');
    }

    return data;
  }

  async saveUser(
    lineId: string,
    displayName: string,
    email: string,
  ): Promise<any> {
    return this.prisma.user.upsert({
      where: { lineId },
      update: {},
      create: {
        lineId,
        name: displayName,
        email,
      },
    });
  }
}
