import { Body, Controller, Get, Patch, Post, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthService } from '@/auth/auth.service';
import { UserContactUpdateDto, UserLoginDto } from './users.dto';
import { AllRoles, AllowRoles, PublicRoute } from '@/auth/auth.decorator';
import { Roles, User } from '@prisma/client';

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
      .signIn(loginDto.studentId, loginDto.password, loginDto.lineToken)
      .then((userToken) => ({ token: userToken }));
  }

  @AllRoles()
  @Get()
  async getUsers() {
    return await this.usersService.getUsers();
  }

  @AllRoles()
  @Get('profile')
  async getUserProfile(@Req() req: any) {
    return await this.usersService.getUserProfile(req.user.userId);
  }

  @AllowRoles(Roles.Admin, Roles.IT, Roles.Board, Roles.HeadHouse)
  @Patch('profile')
  async updateUserProfile(@Req() req: any, @Body() body: User) {
    return await this.usersService.updateUserProfile(req.user.userId, body);
  }

  @Patch('profile/contact')
  async updateUserProfileContact(
    @Req() req: any,
    @Body() body: UserContactUpdateDto,
  ) {
    return await this.usersService.updateUserProfileContact(
      req.user.userId,
      body,
    );
  }

  @Get('profile/line')
  async getLineProfile(@Req() req: any) {
    return await this.usersService.getLineProfile(req.user.userId);
  }
}
