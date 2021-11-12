import { DATABASE_CONNECTION, USER_MODEL } from '@svv/api/core/constants';
import { UserSchema } from './schemas';
import { Connection } from 'mongoose';

/**
 * This provider defines the `User` Model for the current connection.
 */
export const usersModelProvider = {
  provide: USER_MODEL,
  useFactory: (connection: Connection) => connection.model('User', UserSchema),
  inject: [DATABASE_CONNECTION],
};

/**
 * The default providers for the `Users` feature.
 */
export const usersProviders = [usersModelProvider];
