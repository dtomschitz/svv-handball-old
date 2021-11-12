import { Document } from 'mongoose';
import * as models from '@svv/core/models';

export interface ImageTag
  extends Readonly<Omit<models.ImageTag, '_id'>>,
    Document {}
