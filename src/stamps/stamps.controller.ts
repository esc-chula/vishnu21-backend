import { Controller, Get, Param, Query } from '@nestjs/common';
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

  @PublicRoute()
  @Get()
  async stampValidation(
    @Query('stampId') stampId: string,
    @Query('timestamp') timestamp: number,
  ) {
    return this.stampsService.stampValidation(stampId, timestamp);
  }
}
