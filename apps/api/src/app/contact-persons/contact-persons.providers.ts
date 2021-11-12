import {
  CONTACT_PERSON_CATEGORY_MODEL,
  CONTACT_PERSON_MODEL,
  DATABASE_CONNECTION,
} from '@svv/api/core/constants';
import { ContactPersonCategorySchema, ContactPersonSchema } from './schemas';
import { Connection } from 'mongoose';

/**
 * This provider defines the `Contact Person` Model for the current connection.
 */
export const contactPersonsModelProvider = {
  provide: CONTACT_PERSON_MODEL,
  useFactory: (connection: Connection) =>
    connection.model('ContactPerson', ContactPersonSchema, 'contact_persons'),
  inject: [DATABASE_CONNECTION],
};

/**
 * This provider defines the `Contact Person Category` Model for the current connection.
 */
export const contactPersonCateoriesModelProvider = {
  provide: CONTACT_PERSON_CATEGORY_MODEL,
  useFactory: (connection: Connection) =>
    connection.model(
      'ContactPersonCategory',
      ContactPersonCategorySchema,
      'contact_persons_categories',
    ),
  inject: [DATABASE_CONNECTION],
};

/**
 * The default providers for the `Contact Persons` feature.
 */
export const contactPersonsProviders = [
  contactPersonsModelProvider,
  contactPersonCateoriesModelProvider,
];
