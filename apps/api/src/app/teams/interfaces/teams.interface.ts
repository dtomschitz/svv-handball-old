import { Document } from 'mongoose';
import * as models from '@svv/core/models';

export interface Team extends Readonly<Omit<models.Team, '_id'>>, Document {}
