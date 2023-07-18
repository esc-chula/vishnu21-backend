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

  async generateStamp(slugName: string): Promise<{ qrCode: string }> {
    const newStampId = uuidv4();
    let qrCode: string;
    try {
      await this.prisma.stamp.update({
        where: {
          slugName,
        },
        data: {
          stampId: newStampId,
          timestamp: Date.now(),
        },
      });

      qrCode = await qrcode.toDataURL(newStampId);
    } catch (error) {
      throw new BadRequestException(error.message);
    }

    return { qrCode: qrCode };
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
    let isValid = false;
    try {
      await this.prisma.stamp
        .findUnique({
          where: {
            stampId,
            slugName,
          },
        })
        .then((stamp) => {
          const millis = timestamp - stamp.timestamp;
          if (stamp && Math.floor(millis / 1000) <= 300) isValid = true;
        });
    } catch (error) {
      throw new BadRequestException(error.message);
    }

    return { isValid, timestamp: Date.now() };
  }
}
