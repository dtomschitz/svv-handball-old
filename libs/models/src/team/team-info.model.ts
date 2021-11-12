import { Team } from './team.model';

export type TeamInfo = Pick<Team, '_id' | 'abbreviation' | 'name' | 'gender' | 'type' | 'position'>;
