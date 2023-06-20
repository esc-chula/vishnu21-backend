import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { GroupService } from './group.service';
import { EmergencyDTO } from './dto/emergency.dto';

@Controller('group')
export class GroupController {
  constructor(private groupService: GroupService) {}

  @Get('/emergency/:groupId')
  async getEmergency(@Param('groupId') groupId: string) {
    return this.groupService.getEmergency(groupId);
  }

  @Post('/emergency/:groupId')
  async updateEmergency(
    @Param('groupId') groupId: string,
    @Body('contacts') contacts: EmergencyDTO[],
  ) {
    return this.groupService.updateEmergency(groupId, contacts);
  }
}
