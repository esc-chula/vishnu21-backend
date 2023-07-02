import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '@/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async signIn(studentId: string, password: string, returnModel?: boolean) {
    const user = await this.usersService.findOne(studentId);
    // TODO Chula SSO
    if (!user) throw new UnauthorizedException('User not found');
    if (returnModel) return user;
    return this.jwtService.sign(
      {
        userId: user.userId,
        studentId: user.studentId,
        name: user.name,
        profile: user.lineProfile,
        group: user.groupId,
      },
      {
        issuer: 'vishnu21st-it',
        mutatePayload: true,
        subject: user.userId,
      },
    );
  }

  async decode(token: string) {
    return this.jwtService.decode(token);
  }
}
