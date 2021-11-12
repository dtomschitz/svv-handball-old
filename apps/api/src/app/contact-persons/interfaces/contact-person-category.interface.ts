import { Document } from 'mongoose';
import * as models from '@svv/core/models';

export interface ContactPersonCategory
  extends Readonly<Omit<models.ContactPerson, '_id'>>,
    Document {}
