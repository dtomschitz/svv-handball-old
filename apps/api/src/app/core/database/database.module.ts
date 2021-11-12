import { Module } from '@nestjs/common';
import { DatabaseConfigModule } from '@svv/api/core/config/database';
import { databaseProviders } from './database.providers';

@Module({
  imports: [DatabaseConfigModule],
  providers: [...databaseProviders],
  exports: [...databaseProviders],
})
export class DatabaseModule {}
