import { Document } from 'mongoose';
import * as models from '@svv/core/models';

export interface Article extends Readonly<Omit<models.Article, '_id'>>, Document {
}
