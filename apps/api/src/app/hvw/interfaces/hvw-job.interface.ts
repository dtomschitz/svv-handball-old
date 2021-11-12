import { Document } from 'mongoose';
import * as models from '@svv/core/models';

export interface HvwJob
  extends Readonly<Omit<models.HvwJob, 'id' | '_id' | 'createdAt' | 'updatedAt'>>,
    Document {}
