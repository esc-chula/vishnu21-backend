import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { ScoringModule } from './scoring/scoring.module';

@Module({
  imports: [
    ScoringModule,
    PrismaModule, 
  ],
})
export class AppModule {}
