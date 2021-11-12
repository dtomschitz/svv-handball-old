import { HvwGame } from './hvw-game.model';

export interface GameWeek {
  _id: string;
  weeks: {
    previous: string;
    selected: string;
    current: string;
    next: string;
  };
  days: GameDay[];
}

export interface GameDay {
  date: string | 'Invalid Date';
  games: HvwGame[];
}

export enum GamesFilterType {
  ALL,
  ACTIVE,
  YOUTH,
  WIN,
  TIE,
  LOST,
}
