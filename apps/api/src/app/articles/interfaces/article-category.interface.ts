import { Document } from 'mongoose';
import * as models from '@svv/core/models';

export interface ArticleCategory extends Readonly<Omit<models.ArticleCategory, '_id'>>, Document {}
