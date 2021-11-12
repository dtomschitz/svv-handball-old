import { Document } from 'mongoose';
import * as models from '@svv/core/models';

export interface Image extends Readonly<Omit<models.Image, '_id'>>, Document {}
