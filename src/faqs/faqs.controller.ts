import { Controller, Get, Param } from '@nestjs/common';

@Controller('faq')
export class FaqsController {
  constructor(private FaqsService: FaqsService) {}

  @Get('/:event')
  async getFaqByEvent(@Param('event') event: string) {
    return await this.FaqsService.getFaqByEvent(event);
  }
}
