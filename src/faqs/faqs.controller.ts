import { Controller, Get, Param, Body, Patch } from '@nestjs/common';
import { FaqsService } from './faqs.service';

@Controller('faq')
export class FaqsController {
  constructor(private faqsService: FaqsService) {}

  @Get('/:event')
  async getFaqByEvent(@Param('event') event: string) {
    return await this.faqsService.getFaqByEvent(event);
  }

  @Patch('/:id')
  updatePost(@Param('id') id: string, @Body() payload: any) {
    return this.faqsService.updateFaq(id, payload);
  }
}
