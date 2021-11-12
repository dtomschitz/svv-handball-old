import { Document } from 'mongoose';
import * as models from '@svv/core/models';

export interface HvwCachingResult
  extends Readonly<Omit<models.HvwCachingResult, '_id' | 'id' | 'createdAt' | 'updatedAt'>>,
    Document {}
