import { HttpModule, Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { DatabaseModule } from '@svv/api/core/database';
import { AppConfigModule } from '@svv/api/core/config/app';
import { UsersModule } from '@svv/api/users/users.module';
import { TeamsModule } from '@svv/api/teams/teams.module';
import {
  HvwCachingResultService,
  HvwClassService,
  HvwGamesService,
  HvwJobsService,
  HvwTablesService,
  HvwWeeksService,
} from './services';
import { HvwController } from './hvw.controller';
import { hvwProviders } from './hvw.providers';

@Module({
  imports: [
    HttpModule,
    ScheduleModule.forRoot(),
    DatabaseModule,
    AppConfigModule,
    UsersModule,
    TeamsModule,
  ],
  controllers: [HvwController],
  providers: [
    HvwWeeksService,
    HvwTablesService,
    HvwClassService,
    HvwGamesService,
    HvwCachingResultService,
    HvwJobsService,
    ...hvwProviders,
  ],
  exports: [
    HvwWeeksService,
    HvwTablesService,
    HvwClassService,
    HvwGamesService,
    HvwJobsService,
  ],
})
export class HvwModule {}
