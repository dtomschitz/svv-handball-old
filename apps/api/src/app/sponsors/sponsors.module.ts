import { Module } from '@nestjs/common';
import { DatabaseModule } from '@svv/api/core/database';
import { SponsorsService } from './services';
import { SponsorsController } from './sponsors.controller';
import { sponsorsProviders } from './sponsors.providers';

@Module({
  imports: [DatabaseModule],
  controllers: [SponsorsController],
  providers: [SponsorsService, ...sponsorsProviders],
  exports: [SponsorsService],
})
export class SponsorsModule {}
