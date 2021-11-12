import { DATABASE_CONNECTION } from '@svv/api/core/constants';
import { DatabaseConfigService } from '@svv/api/core/config/database';
import * as mongoose from 'mongoose';

/**
 * The database provider which instanciates the connection to the MongoDB.
 */
export const databaseProviders = [
  {
    provide: DATABASE_CONNECTION,
    useFactory: (
      configService: DatabaseConfigService,
    ): Promise<typeof mongoose> =>
      mongoose.connect(configService.MONGO_URI, {
        //Must be set to true in order to fix the deprecation warnings
        useNewUrlParser: true,
        //Must be set to true in order to fix the deprecation warnings
        useCreateIndex: true,
        //Must be set to true in order to fix the deprecation warnings
        useUnifiedTopology: true,
        //Must be set to false in order to fix the deprecation warnings
        useFindAndModify: false,
      }),
    inject: [DatabaseConfigService],
  },
];
