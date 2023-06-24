import { Body, Controller, Get, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { Prisma } from '@prisma/client';

@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService){}
    
    @Get()
    async getUsers(){
      return await this.usersService.getUsers();
    }

    // temp
    @Post()
    async createUser(@Body() data){
      const {groupId, ...rest} = data;
      return await this.usersService.createUser(groupId, rest);
    }

    @Post('group')
    async createGroup(@Body() data: Prisma.GroupCreateInput){
      return await this.usersService.createGroup(data);
    }

}
