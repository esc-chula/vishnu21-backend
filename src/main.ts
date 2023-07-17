import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PrismaService } from './prisma/prisma.service';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('AppLogger');
  const app = await NestFactory.create(AppModule, {
    cors: { origin: process.env.ALLOW_ORIGIN || '*' },
  });
  const prismaService = app.get(PrismaService);
  app.useLogger(logger);
  await prismaService.enableShutdownHooks(app);
  await app.listen(4000);
}
bootstrap();
