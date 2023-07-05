import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { v4 as uuidv4 } from 'uuid';
import * as qrcode from 'qrcode';

@Injectable()
export class StampsService {
  constructor(private prisma: PrismaService) {}

  async generateStamp(slug: string): Promise<{ qrCode: string }> {
    const newStampId = uuidv4();
    let qrCode: string;
    try {
      await this.prisma.stamp.update({
        where: {
          slug,
        },
        data: {
          stampId: newStampId,
          timestamp: Date.now()
        },
      });

      qrCode = await qrcode.toDataURL(newStampId);
    } catch (error) {
      throw new BadRequestException(error.message);
    }

    return { qrCode: qrCode };
  }
}
