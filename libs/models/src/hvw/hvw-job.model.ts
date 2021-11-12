import { MongoDocument } from '../mongo-document.model';
import { HvwCachingType } from './hvw-caching-type.model';

export interface HvwJob extends MongoDocument {
  name: string;
  type: HvwCachingType;
  cronExpression: string;
  lastExecution?: string;
  disabled?: boolean;
}
