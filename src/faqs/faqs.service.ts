import { Injectable, BadRequestException } from '@nestjs/common';
import { Faq } from '@prisma/client';
import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class FaqsService {
  constructor(private prisma: PrismaService) {}

  async getFaqByEvent(event: string): Promise<Faq[]> {
    try {
      const faqInfo: Faq[] = await this.prisma.faq.findMany({
        where: { event: event },
        orderBy: [{ priority: 'desc' }],
      });

      return faqInfo;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
