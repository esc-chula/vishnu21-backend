import { Body, Controller, Get, Param, Patch, Req } from '@nestjs/common';
import { GroupsService } from './groups.service';
import { EmergencyDTO } from './types/emergency.dto';

@Controller('groups')
export class GroupsController {
  constructor(private groupsService: GroupsService) {}
  @Get()
  async getGroupsInfo() {
    return await this.groupsService.getGroupsInfo();
  }

  @Get('/user')
  async getGroupInfoById(@Req() req: any) {
    return await this.groupsService.getGroupInfoById(req.user.groupId);
  }

  @Get('/emergency/:groupId')
  async getEmergency(@Param('groupId') groupId: string) {
    return this.groupsService.getEmergency(groupId);
  }

  @Patch('/emergency/:groupId')
  async updateEmergency(
    @Param('groupId') groupId: string,
    @Body('contacts') contacts: EmergencyDTO[],
  ) {
    return this.groupsService.updateEmergency(groupId, contacts);
  }
}
