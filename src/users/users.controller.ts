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

}
