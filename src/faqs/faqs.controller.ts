import { Controller, Get, Param } from '@nestjs/common';
import { FaqsService } from './faqs.service';

@Controller('faq')
export class FaqsController {
  constructor(private faqsService: FaqsService) {}

  @Get('/:event')
  async getFaqByEvent(@Param('event') event: string) {
    return await this.faqsService.getFaqByEvent(event);
  }
}
