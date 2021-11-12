import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { Team } from '@svv/core/models';

export interface TeamsState extends EntityState<Team, string> {
  loadedTeams: string[];
}

@Injectable({
  providedIn: 'root',
})
@StoreConfig({ name: 'teams', idKey: '_id' })
export class TeamsStore extends EntityStore<TeamsState> {
  constructor() {
    super({
      loadedTeams: [],
      loading: true,
    });
  }
}
