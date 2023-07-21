import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { v4 as uuidv4 } from 'uuid';
import * as qrcode from 'qrcode';
import { Prisma } from '@prisma/client';

@Injectable()
export class StampsService {
  constructor(private prisma: PrismaService) {}

  async getAllClubs() {
    return await this.prisma.stamp.findMany({
      select: {
        clubName: true,
        objective: true,
        previousActivity: true,
        headquarter: true,
        slugName: true,
        tag: true,
        logo: true,
        id: true,
      },
    });
  }

  async getClub(id: string) {
    return await this.prisma.stamp.findFirst({
      where: { id },
      select: {
        clubName: true,
        objective: true,
        previousActivity: true,
        headquarter: true,
        slugName: true,
        tag: true,
        logo: true,
        id: true,
      },
    });
  }

  async generateStamp(
    slugName: string,
  ): Promise<{ qrCode: string; clubName: string }> {
    try {
      const stampId = uuidv4();
      const clubName = await this.prisma.stamp
        .findUnique({
          where: { slugName },
        })
        .then((club) => {
          if (club) return club.clubName;
          else throw new BadRequestException('Club not found');
        });
      await this.prisma.stamp.update({
        where: {
          slugName,
        },
        data: {
          stampId,
          timestamp: Date.now(),
        },
      });

      return {
        qrCode: await qrcode.toDataURL(JSON.stringify({ slugName, stampId })),
        clubName,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async stampSubmission(
    userId: string,
    stampCount: number,
    stampCollected: Prisma.JsonValue[],
  ): Promise<{ isSuccess: boolean }> {
    let isSuccess = false;
    try {
      await this.prisma.user.update({
        where: {
          userId: userId,
        },
        data: { stampCount, stampCollected: stampCollected },
      });
      isSuccess = true;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
    return { isSuccess: isSuccess };
  }

  async stampValidation(slugName: string, stampId: string, timestamp: number) {
    return await this.prisma.stamp
      .findUnique({
        where: {
          stampId,
          slugName,
        },
      })
      .then((stamp) => {
        const millis = timestamp - stamp.timestamp;
        if (stamp && Math.floor(millis / 1000) <= 300)
          return {
            isValid: true,
            stampHash: stamp.id,
            timestamp: Date.now(),
          };
        return {
          isValid: false,
          timestamp: Date.now(),
        };
      })
      .catch((error) => {
        throw new BadRequestException(error.message);
      });
  }
}
