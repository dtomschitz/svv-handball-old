import { MongoDocument } from '../mongo-document.model';

export interface HvwClass extends MongoDocument {
  _id: string;
  id: string;
  shortName: string;
  longName: string;
}
