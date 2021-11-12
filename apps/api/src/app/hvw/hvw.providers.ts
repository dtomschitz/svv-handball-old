import {
  DATABASE_CONNECTION,
  HVW_CACHING_RESULT_MODEL,
  HVW_CLASS_MODEL,
  HVW_GAME_MODEL,
  HVW_JOB_MODEL,
  HVW_TABLE_MODEL,
  HVW_WEEK_MODEL,
} from '@svv/api/core/constants';
import { Connection } from 'mongoose';
import {
  HvwCachingResultSchema,
  HvwClassSchema,
  HvwGameSchema,
  HvwJobSchema,
  HvwTableSchema,
  HvwWeekSchema,
} from './schemas';

/**
 * This provider defines the `HvwClass` Model for the current connection.
 */
export const hvwClassModelProvider = {
  provide: HVW_CLASS_MODEL,
  useFactory: (connection: Connection) =>
    connection.model('HvwClass', HvwClassSchema, 'hvw_classes'),
  inject: [DATABASE_CONNECTION],
};

/**
 * This provider defines the `HvwTable` Model for the current connection.
 */
export const hvwTableModelProvider = {
  provide: HVW_TABLE_MODEL,
  useFactory: (connection: Connection) =>
    connection.model('HvwTable', HvwTableSchema, 'hvw_tables'),
  inject: [DATABASE_CONNECTION],
};

/**
 * This provider defines the `HvwWeek` Model for the current connection.
 */
export const hvwWeekModelProvider = {
  provide: HVW_WEEK_MODEL,
  useFactory: (connection: Connection) =>
    connection.model('HvwWeek', HvwWeekSchema, 'hvw_weeks'),
  inject: [DATABASE_CONNECTION],
};

/**
 * This provider defines the `HvwGame` Model for the current connection.
 */
export const hvwGameModelProvider = {
  provide: HVW_GAME_MODEL,
  useFactory: (connection: Connection) =>
    connection.model('HvwGame', HvwGameSchema, 'hvw_games'),
  inject: [DATABASE_CONNECTION],
};

/**
 * This provider defines the `HvwCachingResult` Model for the current connection.
 */
export const hvwCachingResultModelProvider = {
  provide: HVW_CACHING_RESULT_MODEL,
  useFactory: (connection: Connection) =>
    connection.model(
      'HvwCachingResult',
      HvwCachingResultSchema,
      'hvw_caching_results',
    ),
  inject: [DATABASE_CONNECTION],
};

/**
 * This provider defines the `HvwJob` Model for the current connection.
 */
export const hvwJobModelProvider = {
  provide: HVW_JOB_MODEL,
  useFactory: (connection: Connection) =>
    connection.model('HvwJob', HvwJobSchema, 'hvw_jobs'),
  inject: [DATABASE_CONNECTION],
};

/**
 * The default providers for the `HVW` feature.
 */
export const hvwProviders = [
  hvwClassModelProvider,
  hvwTableModelProvider,
  hvwWeekModelProvider,
  hvwGameModelProvider,
  hvwCachingResultModelProvider,
  hvwJobModelProvider,
];
