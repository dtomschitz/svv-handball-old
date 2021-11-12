import { User } from '../auth';
import { MongoDocument } from '../mongo-document.model';
import { HvwCachingType } from './hvw-caching-type.model';

export interface HvwCachingResult extends MongoDocument {
  _id: string;
  type: HvwCachingType;
  neededTime: string;
  status: number;
  inserted: number;
  upserted: number;
  matched: number;
  modified: number;
  removed: number;
  userId?: string;
  user?: Pick<User, 'firstName' | 'lastName'>;
}
