import { Injectable } from '@angular/core';
import {
  ActiveState,
  EntityState,
  EntityStore,
  StoreConfig,
} from '@datorama/akita';
import { GameWeek, HvwWeek } from '@svv/core/models';

export interface GamesState extends EntityState<GameWeek, string>, ActiveState {
  weeks: HvwWeek[];
}

@Injectable({
  providedIn: 'root',
})
@StoreConfig({ name: 'games', idKey: '_id' })
export class GamesStore extends EntityStore<GamesState> {
  constructor() {
    super({
      loading: true,
      weeks: [],
    });
  }
}
