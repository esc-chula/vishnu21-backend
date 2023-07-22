import { Controller, Get, Param, Put, Body, Req, Query } from '@nestjs/common';
import { StampsService } from './stamps.service';
import { Prisma } from '@prisma/client';
import { PublicRoute } from '@/auth/auth.decorator';

@Controller('stamps')
export class StampsController {
  constructor(private stampsService: StampsService) {}

  @PublicRoute()
  @Get()
  async getClubs() {
    return this.stampsService.getAllClubs();
  }

  @PublicRoute()
  @Get('info/:id')
  async getClub(@Param('id') id: string) {
    return this.stampsService.getClub(id);
  }

  @PublicRoute()
  @Get('create/:slug')
  async generateStamp(@Param('slug') slug: string) {
    return this.stampsService.generateStamp(slug);

  @Put()
  async stampSubmission(
    @Req() req: any,
    @Body('stampCount') stampCount: number,
    @Body('stampCollected') stampCollected: Prisma.JsonValue[],
  ) {
    return this.stampSubmission(req.user.userId, stampCount, stampCollected);
  }

  @PublicRoute()
  @Get('validate')
  async stampValidation(
    @Query('stampId') stampId: string,
    @Query('slug') slug: string,
    @Query('timestamp') timestamp: string,
  ) {
    return this.stampsService.stampValidation(slug, stampId, Date.now());
  }
}
