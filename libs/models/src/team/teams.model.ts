import { TeamInfo } from './team-info.model';

export interface Teams {
  active: TeamInfo[];
  male: TeamInfo[];
  female: TeamInfo[];
  mixed: TeamInfo[];
}
