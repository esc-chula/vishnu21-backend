import { Controller, Post, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
    constructor(private userService: UserService) {}

    @Post()
    craeteUser() {
        return this.userService.createUser();
    }
}
