import {
  Controller,
  Get,
  Param
} from '@nestjs/common';
import { StampsService } from './stamps.service';

@Controller('users/stamp')
export class StampsController {
  constructor(private stampsService: StampsService) {}

  @Get('/:slug')
  async generateStamp(@Param('slug') slug: string) {
    return this.stampsService.generateStamp(slug);
  }
}