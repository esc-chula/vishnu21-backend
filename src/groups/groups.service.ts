import { Injectable, BadRequestException } from '@nestjs/common';
import { Contacts, Group } from '@prisma/client';
import { PrismaService } from '@/prisma/prisma.service';
import { EmergencyDTO } from './types/emergency.dto';

@Injectable()
export class GroupsService {
  constructor(private prisma: PrismaService) {}

  async getGroupsInfo(): Promise<Group[]> {
    try {
      const groupsInfo: Group[] = await this.prisma.group.findMany({
        orderBy: [{ group: 'asc' }],
      });
      return groupsInfo;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getGroupInfoByname(group: string) {
    try {
      const groupInfo: Group = await this.prisma.group.findFirst({
        where: { group },
        include: { members: true, posts: true },
      });
      return groupInfo;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getGroupInfoById(groupId: string): Promise<Group> {
    try {
      const groupInfo: Group = await this.prisma.group.findUnique({
        where: { groupId },
        include: { members: true, posts: true },
      });
      return groupInfo;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getGroupContactInfoById(groupId: string) {
    try {
      const groupInfo = await this.prisma.group.findUnique({
        where: { groupId },
        select: { contacts: true },
      });
      return groupInfo;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async addLineGroup(groupId: string, lineGroup: string): Promise<Group> {
    return await this.prisma.group.update({
      where: { groupId },
      data: { lineGroup },
    });
  }

  async getEmergency(groupId: string): Promise<{ contacts: Contacts[] }> {
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
  ): Promise<Group> {
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
