import { Controller, Get, Param, Body, Patch, Post } from '@nestjs/common';
import { FaqsService } from './faqs.service';
import { AllowRoles } from '@/auth/auth.decorator';
import { Roles } from '@prisma/client';

@Controller('faq')
export class FaqsController {
  constructor(private faqsService: FaqsService) {}

  @Get('/:event')
  async getFaqByEvent(@Param('event') event: string) {
    return await this.faqsService.getFaqByEvent(event);
  }

  @AllowRoles(Roles.IT, Roles.Admin)
  @Patch('/:id')
  async updateFaq(@Param('id') id: string, @Body() payload: any) {
    return this.faqsService.updateFaq(id, payload);
  }

  @Post('/')
  async createFaq(@Body() payload: any) {
    return this.faqsService.createFaq(payload);
  }
}
