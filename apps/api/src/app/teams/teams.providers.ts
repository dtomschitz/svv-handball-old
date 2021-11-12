import { Connection } from 'mongoose';
import { DATABASE_CONNECTION, TEAM_MODEL } from '@svv/api/core/constants';
import { TeamSchema } from './schemas';

/**
 * This provider defines the `Team` Model for the current connection.
 */
export const teamModelProvider = {
  provide: TEAM_MODEL,
  useFactory: (connection: Connection) => connection.model('Team', TeamSchema),
  inject: [DATABASE_CONNECTION],
};

/**
 * The default providers for the `Teams` feature.
 */
export const teamsProviders = [teamModelProvider];
