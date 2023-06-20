import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { TEmergency, TGroup } from './dto/group.dto';
import { ContactPayload, GroupPayload } from '@prisma/client';

@Injectable()
export class GroupService {
  constructor(private prisma: PrismaService) {}

  async getEmergency(groupId: string): Promise<{ contacts: ContactPayload[] }> {
    try {
      const emergency = await this.prisma.group.findUnique({
        where: { groupId },
      });

      return { contacts: emergency.contacts };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async updateEmergency(
    groupId: string,
    contacts: TEmergency[],
  ): Promise<TGroup> {
    try {
      const emergency = await this.prisma.group.update({
        where: { groupId },
        data: { contacts },
      });

      return emergency;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
