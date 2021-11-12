import { Module } from '@nestjs/common';
import { DatabaseModule } from '@svv/api/core/database';
import {
  ContactPersonCategoriesService,
  ContactPersonsService,
} from './services';
import { ContactPersonsController } from './contact-persons.controller';
import { contactPersonsProviders } from './contact-persons.providers';
import { ContactPersonCategoriesController } from './contact-person-categories.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [ContactPersonCategoriesController, ContactPersonsController],
  providers: [
    ContactPersonCategoriesService,
    ContactPersonsService,
    ...contactPersonsProviders,
  ],
  exports: [ContactPersonCategoriesService, ContactPersonsService],
})
export class ContactPersonsModule {}
