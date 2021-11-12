import { forwardRef, Module } from '@nestjs/common';
import { DatabaseModule } from '@svv/api/core/database';
import { TeamsModule } from '@svv/api/teams';
import { ArticlesModule } from '@svv/api/articles';
import { UsersService } from './services';
import { UsersController } from './users.controller';
import { usersProviders } from './users.providers';

@Module({
  imports: [
    DatabaseModule,
    forwardRef(() => TeamsModule),
    forwardRef(() => ArticlesModule),
  ],
  controllers: [UsersController],
  providers: [UsersService, ...usersProviders],
  exports: [UsersService],
})
export class UsersModule {}
