import { Document } from 'mongoose';
import * as models from '@svv/core/models';

export interface Sponsor extends Readonly<Omit<models.Sponsor, '_id'>>, Document {}
