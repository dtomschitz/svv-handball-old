import { DATABASE_CONNECTION } from '@svv/api/core/constants';
import { MongoMemoryServer } from 'mongodb-memory-server';
import * as mongoose from 'mongoose';

let mongod: MongoMemoryServer;

export const rootMongooseTestProvider = {
  provide: DATABASE_CONNECTION,
  useFactory: async () => {
    mongod = new MongoMemoryServer();

    return mongoose.connect(await mongod.getUri(), {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    });
  },
};

export const closeInMongodConnection = async () => {
  if (mongod) {
    await mongod.stop();
  }
};
