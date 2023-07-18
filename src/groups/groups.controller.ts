import { Body, Controller, Get, Param, Patch, Req } from '@nestjs/common';
import { GroupsService } from './groups.service';
import { EmergencyDTO } from './types/emergency.dto';
import { AllowRoles } from '@/auth/auth.decorator';

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

  @AllowRoles('HeadHouse', 'COOP', 'Admin')
  @Patch('line')
  async addLineGroup(@Req() req: any, @Body('lineGroup') lineGroup: string) {
    return await this.groupsService.addLineGroup(req.user.groupId, lineGroup);
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
