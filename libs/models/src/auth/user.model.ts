import { MongoDocument } from '../mongo-document.model';
import { UserRole } from './user-role.model';

export interface User extends MongoDocument {
  _id: string;
  email: string;
  password?: string;
  role: UserRole;
  firstName: string;
  lastName: string;
  canLogin: boolean;
  lastLogin?: string;
  refreshToken?: string;
}
