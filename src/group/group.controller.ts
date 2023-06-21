import { Body, Controller, Get, Param, Patch } from '@nestjs/common';
import { GroupService } from './group.service';
import { EmergencyDTO } from './types/emergency.dto';

@Controller('group')
export class GroupController {
  constructor(private groupService: GroupService) {}

  @Get('/emergency/:groupId')
  async getEmergency(@Param('groupId') groupId: string) {
    return this.groupService.getEmergency(groupId);
  }

  @Patch('/emergency/:groupId')
  async updateEmergency(
    @Param('groupId') groupId: string,
    @Body('contacts') contacts: EmergencyDTO[],
  ) {
    return this.groupService.updateEmergency(groupId, contacts);
  }
}
