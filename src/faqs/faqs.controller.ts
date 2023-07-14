import { Controller, Get, Param, Body, Patch } from '@nestjs/common';
import { FaqsService } from './faqs.service';
import { AllRoles, AllowRoles, PublicRoute } from '@/auth/auth.decorator';
import { Roles } from '@prisma/client';

@Controller('faqs')
export class FaqsController {
  constructor(private faqsService: FaqsService) {}

  @AllRoles()
  @PublicRoute()
  @Get('/:event')
  async getFaqByEvent(@Param('event') event: string) {
    return await this.faqsService.getFaqByEvent(event);
  }

  @AllowRoles(Roles.IT, Roles.Admin)
  @Patch('/:id')
  async updateFaq(@Param('id') id: string, @Body() payload: any) {
    return this.faqsService.updateFaq(id, payload);
  }
}
