import { Controller, Get, Param } from '@nestjs/common';
import { StampsService } from './stamps.service';
import { PublicRoute } from '@/auth/auth.decorator';

@Controller('users/stamp')
export class StampsController {
  constructor(private stampsService: StampsService) {}

  @PublicRoute()
  @Get('/:slug')
  async generateStamp(@Param('slug') slug: string) {
    return this.stampsService.generateStamp(slug);
  }
}
