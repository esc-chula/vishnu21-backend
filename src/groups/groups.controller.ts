import { Body, Controller, Get, Param, Patch } from "@nestjs/common";
import { GroupsService } from "./groups.service";
import { EmergencyDTO } from "./types/emergency.dto";

@Controller('groups')
export class GroupsController {
  constructor(private groupsService: GroupsService){}
    @Get()
    async getGroupsInfo(){
      return await this.groupsService.getGroupsInfo();
    }
    @Get('/:groupId')
    async getGroupInfoById(@Param('groupId') groupId: string){
      return await this.groupsService.getGroupInfoById(groupId);
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