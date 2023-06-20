import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { GroupService } from './group.service';
import { TEmergency } from './dto/group.dto';

@Controller('group')
export class GroupController {
  constructor(private groupService: GroupService) {}

  @Get('/emergency')
  async getEmergency() {
    return this.groupService.getEmergency();
  }

  @Post('/emergency/:groupId')
  async updateEmergency(
    @Param('groupId') groupId: string,
    @Body('contact') contact: TEmergency,
  ) {
    return this.groupService.updateEmergency(groupId, contact);
  }
}
