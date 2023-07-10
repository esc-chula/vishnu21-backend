import { Controller, Get, Param, Put, Body, Req } from '@nestjs/common';
import { StampsService } from './stamps.service';
import { Prisma } from '@prisma/client';

@Controller('users/stamp')
export class StampsController {
  constructor(private stampsService: StampsService) {}

  @Get('/:slug')
  async generateStamp(@Param('slug') slug: string) {
    return this.stampsService.generateStamp(slug);
  }

  @Put()
  async stampSubmission(
    @Req() req: any,
    @Body('stampCount') stampCount: number,
    @Body('stampCollected') stampCollected: Prisma.JsonValue[],
  ) {
    return this.stampSubmission(req.user.userId, stampCount, stampCollected);
  }
}
