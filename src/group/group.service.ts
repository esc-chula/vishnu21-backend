import {
  BadRequestException,
  Injectable,
  NotAcceptableException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { TEmergency, TGroup } from './dto/group.dto';

@Injectable()
export class GroupService {
  constructor(private prisma: PrismaService) {}

  async getEmergency(): Promise<any> {
    // const emergency = await this.prisma.emergency.findMany();
  }

  async updateEmergency(groupId: string, contact: TEmergency): Promise<TGroup> {
    try {
      const emergency = await this.prisma.group.update({
        where: { groupId },
        data: { contact },
      });

      return emergency;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
