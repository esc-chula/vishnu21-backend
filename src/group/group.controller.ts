import { Controller, Post } from '@nestjs/common';
import { GroupService } from './group.service';

@Controller('group')
export class GroupController {
    constructor(private groupService: GroupService) {}

    @Post()
    craeteGroup() {
        return this.groupService.createGroup();
    }
}
