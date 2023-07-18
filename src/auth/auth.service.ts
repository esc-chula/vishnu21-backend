import {
  Injectable,
  Logger,
  ServiceUnavailableException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '@/users/users.service';
import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom, map } from 'rxjs';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  private readonly logger: Logger;
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly httpService: HttpService,
  ) {
    this.logger = new Logger(AuthService.name);
  }

  async signIn(
    studentId: string,
    password: string,
    lineToken?: string,
    returnModel?: boolean,
  ) {
    const ticket = await firstValueFrom(
      this.httpService
        .post(
          'https://account.it.chula.ac.th/login',
          new URLSearchParams({
            username: studentId,
            password,
            service: 'https://liff.vishnu21.chula.engineering/login',
            serviceName: 'Vishnu21st Login Service',
            remember: '1',
          }),
        )
        .pipe(
          map((res) => res.data),
          map((data) => {
            if (data.type === 'redirect') return data.ticket;
            throw new UnauthorizedException('Invalid username or password');
          }),
        )
        .pipe(
          catchError((err) => {
            if (err.status === 401) throw err;
            this.logger.error(JSON.stringify(err));
            throw new ServiceUnavailableException(
              'Login service has been failed',
            );
          }),
        ),
    );
    const user = await this.usersService.findOneByStudentId(studentId);
    if (!user) throw new UnauthorizedException('User not found');
    console.log('User Logged In');
    await this.usersService.assignSSOTicket(studentId, ticket);
    this.usersService
      .updateUserProfile(user.userId, {
        lineIdToken: lineToken,
      })
      .then(async (user) => {
        console.log(await this.usersService.getLineProfile(user.userId));
      });
    this.logger.debug(JSON.stringify(user));
    if (returnModel) return user;
    return this.jwtService.sign(
      await this.usersService.getUserProfile(user.userId),
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

  async validateUser(userId: string) {
    return await this.usersService.findOne(userId).then(async (user) => {
      return await firstValueFrom(
        this.httpService
          .get('https://account.it.chula.ac.th/serviceValidation', {
            headers: {
              DeeAppId: this.configService.get('DEEPAPP_ID'),
              DeeAppSecret: this.configService.get('DEEPAPP_SECRET'),
              DeeTicket: user.ticketToken,
            },
          })
          .pipe(
            map((res) => res.data),
            map((data) => {
              this.logger.debug(JSON.stringify(data));
              if (data.ouid === user.studentId) return true;
              return false;
            }),
          ),
      );
    });
  }
}
