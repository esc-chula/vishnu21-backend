import {
  Controller,
  Get,
  Param,
  Res,
} from '@nestjs/common';
import { StampsService } from './stamps.service';
import { Response } from 'express';
import * as qrcode from 'qrcode';
import { v4 as uuidv4 } from 'uuid';
import sharp from 'sharp';
import bufferImage from 'buffer-image';

@Controller('users/stamp')
export class StampsController {
  constructor(private stampsService: StampsService) {}

  @Get('/:slug')
  async generateStamp(@Param('slug') slug: string) {
    return this.stampsService.generateStamp(slug);
  }
}