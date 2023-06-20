import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { GroupService } from './group.service';
import { TEmergency } from './dto/group.dto';

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
    @Body('contacts') contacts: TEmergency[],
  ) {
    return this.groupService.updateEmergency(groupId, contacts);
  }
}
