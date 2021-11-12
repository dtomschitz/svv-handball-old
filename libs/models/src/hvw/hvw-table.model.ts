import { MongoDocument } from '../mongo-document.model';
import { HvwClass } from './hvw-class.model';

export interface HvwScore {
  position: number;
  teamName: string;
  goals: {
    got: number;
    shot: number;
  };
  games: {
    won: number;
    lost: number;
    equal: number;
    played: number;
  };
  points: {
    plus: number;
    minus: number;
  };
  liveTeam: boolean;
}

export interface HvwTable extends MongoDocument {
  classId: string;
  class?: Pick<HvwClass, '_id' | 'id' | 'longName' | 'shortName'>;
  scores: HvwScore[];
}
