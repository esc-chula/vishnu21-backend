import { Controller, Get, Query } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('line')
  async lineLogin(@Query('access_token') accessToken: string): Promise<any> {
    try {
      const userData = await this.authService.verifyAccessToken(accessToken);
      const user = await this.authService.saveUser(
        userData.sub,
        userData.name,
        userData.email,
      );

      return {
        message: 'User data saved successfully',
        user,
      };
    } catch (error) {
      return {
        error: 'Invalid access token',
      };
    }
  }
}
