import { Document } from 'mongoose';
import * as models from '@svv/core/models';

export interface User
  extends Readonly<Omit<models.User, '_id' | 'id' | 'createdAt' | 'updatedAt'>>,
    Document {}
