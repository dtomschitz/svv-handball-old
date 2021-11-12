import { Document } from 'mongoose';
import * as models from '@svv/core/models';

export interface HvwTable
  extends Readonly<Omit<models.HvwTable, 'id' | '_id' | 'createdAt' | 'updatedAt'>>,
    Document {}
