import { Document } from 'mongoose';
import * as models from '@svv/core/models';

export interface HvwGame extends Readonly<Omit<models.HvwGame, '_id' | 'id'>>, Document {}
