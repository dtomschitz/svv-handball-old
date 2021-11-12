import { HvwGame } from './hvw-game.model';

export interface HvwSchedule {
  classId: string;
  games: HvwGame[];
}
