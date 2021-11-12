import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { GameWeek } from '@svv/core/models';
import { Observable } from 'rxjs';
import { GamesState, GamesStore } from './games.store';

@Injectable({
  providedIn: 'root',
})
export class GamesQuery extends QueryEntity<GamesState> {
  constructor(protected store: GamesStore) {
    super(store);
  }

  selectCurrentGameWeek() {
    return this.selectActive() as Observable<GameWeek>;
  }

  selectEncounters(week: string) {
    return this.selectAll({
      filterBy: [gameWeek => gameWeek._id === week],
    });
  }

  selectWeeks() {
    return this.select(state => state.weeks);
  }
}
