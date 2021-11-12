import { Module } from '@nestjs/common';
import { AppConfigModule } from '@svv/api/core/config/app';
import { DatabaseModule } from '@svv/api/core/database';
import { ArticlesModule } from '@svv/api/articles';
import { AuthModule } from '@svv/api/auth';
import { ContactPersonsModule } from '@svv/api/contact-persons';
import { HvwModule } from '@svv/api/hvw';
import { ImagesModule } from '@svv/api/images';
import { SponsorsModule } from '@svv/api/sponsors';
import { TeamsModule } from '@svv/api/teams';
import { UsersModule } from '@svv/api/users';
import { AppController } from './app.controller';

@Module({
  imports: [
    AppConfigModule,
    DatabaseModule,
    AuthModule,
    ArticlesModule,
    ContactPersonsModule,
    HvwModule,
    ImagesModule,
    SponsorsModule,
    TeamsModule,
    UsersModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
