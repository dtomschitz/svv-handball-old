import { Team } from '../team';
import { HvwClass } from './hvw-class.model';

export interface HvwGame {
  _id: string;
  id: number;
  appId: number;
  classId: string;
  class?: Pick<HvwClass, 'shortName' | 'longName'>;
  team?: Pick<Team, 'name' | 'abbreviation' | 'position' | 'type'>;
  no: number;
  sGId: number;
  referee: string;
  weekDay: string;
  week: string;
  date: string;
  time: string;
  comment: string;
  groupsortTxt: string;
  live: boolean;
  teams: {
    home: {
      name: string;
      points: number;
      goals: string;
      goals_1: string;
    };
    guest: {
      name: string;
      points: number;
      goals: string;
      goals_1: string;
    };
  };
  gymnasium: {
    id: number;
    name: string;
    no: number;
    postal: number;
    street: string;
    town: string;
  };
}
