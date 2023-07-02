import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthService } from '../auth/auth.service';
import { UserLoginDto } from './users.dto';
import { PublicRoute } from '../auth/auth.decorator';

@Controller('users')
export class UsersController {
  constructor(
    private usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @PublicRoute()
  @Post('login')
  async userLogin(@Body() loginDto: UserLoginDto) {
    return await this.authService
      .signIn(loginDto.studentId, loginDto.password)
      .then((userToken) => {
        return { token: userToken };
      });
  }

  @Get()
  async getUsers() {
    return await this.usersService.getUsers();
  }
}
