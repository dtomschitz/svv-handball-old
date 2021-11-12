import { Connection } from 'mongoose';
import { DATABASE_CONNECTION, SPONSOR_MODEL } from '@svv/api/core/constants';
import { SponsorSchema } from './schemas';

/**
 * This provider defines the `Sponsor` Model for the current connection.
 */
export const sponsorsModelProvider = {
  provide: SPONSOR_MODEL,
  useFactory: (connection: Connection) =>
    connection.model('Sponsor', SponsorSchema),
  inject: [DATABASE_CONNECTION],
};

/**
 * The default providers for the `Sponsors` feature.
 */
export const sponsorsProviders = [sponsorsModelProvider];
