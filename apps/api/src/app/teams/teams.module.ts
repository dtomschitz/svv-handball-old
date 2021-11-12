import { forwardRef, Module } from '@nestjs/common';
import { DatabaseModule } from '@svv/api/core/database';
import { UsersModule } from '@svv/api/users';
import { TeamsService } from '@svv/api/teams/services';
import { TeamsController } from './teams.controller';
import { teamsProviders } from './teams.providers';

@Module({
  imports: [DatabaseModule, forwardRef(() => UsersModule)],
  controllers: [TeamsController],
  providers: [TeamsService, ...teamsProviders],
  exports: [TeamsService],
})
export class TeamsModule {}
