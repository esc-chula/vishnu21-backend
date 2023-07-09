import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { GroupsModule } from './groups/groups.module';
import { ScoresModule } from './scores/scores.module';
import { FaqsModule } from './faqs/faqs.module';
import { PostsModule } from './posts/posts.module';
import { StampsModule } from './stamps/stamps.module';
import { CommentsModule } from './comments/comments.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { environmentValidator } from './schema';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth/auth.guard';

@Module({
  imports: [
    ConfigModule.forRoot({
      ignoreEnvFile: process.env.NODE_ENV === 'production',
      isGlobal: true,
      validationSchema: environmentValidator,
      validationOptions: {
        allowUnknown: true,
        abortEarly: true,
      },
    }),
    PrismaModule,
    GroupsModule,
    ScoresModule,
    PostsModule,
    CommentsModule,
    UsersModule,
    StampsModule,
    AuthModule,
    FaqsModule,
    GamesModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
