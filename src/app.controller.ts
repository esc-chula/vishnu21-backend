import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';

@Controller()
export class AppController {
  constructor(private prisma: PrismaService) {}

  @Get()
  async getHello(): Promise<any> {
    return await this.prisma.group.create({
      data: {
        houseName: 'Boom',
        group: 'M',
      },
    });
  }
}
