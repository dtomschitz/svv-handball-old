import { Document } from 'mongoose';
import * as models from '@svv/core/models';

export interface HvwWeek
  extends Readonly<Omit<models.HvwWeek, 'id' | '_id' | 'createdAt' | 'updatedAt'>>,
    Document {}
