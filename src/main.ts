import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('AppLogger');
  const app = await NestFactory.create(AppModule, {
    cors: { origin: process.env.ALLOW_ORIGIN || '*' },
  });
  await app.init();
  app.useLogger(logger);
  app.enableShutdownHooks();
  await app.listen(4000);
}
bootstrap();
