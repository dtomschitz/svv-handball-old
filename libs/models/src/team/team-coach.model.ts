import { User } from '../auth';

export type TeamCoach = Pick<User, '_id' | 'firstName' | 'lastName'>;
