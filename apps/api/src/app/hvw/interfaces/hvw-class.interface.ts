import { Document } from 'mongoose';
import * as models from '@svv/core/models';

export interface HvwClass extends Readonly<Omit<models.HvwClass, '_id' | 'id'>>, Document {}
