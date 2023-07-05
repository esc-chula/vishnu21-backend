import { Injectable, BadRequestException } from '@nestjs/common';
import { Faq } from '@prisma/client';
import { PrismaService } from '@/prisma/prisma.service';
import { FaqDTO } from './types/faq.dto';

@Injectable()
export class FaqsService {
  constructor(private prisma: PrismaService) {}

  async getFaqByEvent(event: string): Promise<Faq[]> {
    try {
      const faqInfo: Faq[] = await this.prisma.faq.findMany({
        where: { event: event },
      });

      faqInfo.sort((a, b) => b.priority - a.priority);

      return faqInfo;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async updateFaq(id: string, payload: FaqDTO): Promise<Faq> {
    try {
      const faqInfo = this.prisma.faq.update({
        where: { faqId: id },
        data: {
          ...payload,
        },
      });
      return faqInfo;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
