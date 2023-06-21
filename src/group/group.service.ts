import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { TGroup } from './types/group';
import { ContactsPayload } from '@prisma/client';
import { EmergencyDTO } from './types/emergency.dto';

@Injectable()
export class GroupService {
  constructor(private prisma: PrismaService) {}

  async getEmergency(
    groupId: string,
  ): Promise<{ contacts: ContactsPayload[] }> {
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
    contacts: EmergencyDTO[],
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
