import { Controller, Get, Param, Put, Body, Req, Query } from '@nestjs/common';
import { StampsService } from './stamps.service';
import { Prisma } from '@prisma/client';
import { PublicRoute } from '@/auth/auth.decorator';

@Controller('users/stamp')
export class StampsController {
  constructor(private stampsService: StampsService) {}

  @PublicRoute()
  @Get('/:slug')
  async generateStamp(
    @Param('slug') slug: string,
    @Query('stampName') stampName: string,
  ) {
    return this.stampsService.generateStamp(slug, stampName || 'Unknown Stamp');
  }

  @Put()
  async stampSubmission(
    @Req() req: any,
    @Body('stampCount') stampCount: number,
    @Body('stampCollected') stampCollected: Prisma.JsonValue[],
  ) {
    return this.stampSubmission(req.user.userId, stampCount, stampCollected);
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
