import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { v4 as uuidv4 } from 'uuid';
import * as qrcode from 'qrcode';

@Injectable()
export class StampsService {
  constructor(private prisma: PrismaService) {}

  async generateStamp(slug: string) {
    const newStampId = uuidv4();
    await this.prisma.stamp.update({
      where: {
        slug,
      },
      data: {
        stampId: newStampId,
      },
    });

    const qrCode =  await qrcode.toDataURL(newStampId)
    return { qrCode : qrCode };
  }
}
