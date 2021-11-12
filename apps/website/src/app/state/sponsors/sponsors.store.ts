import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { Sponsor } from '@svv/core/models';

export interface SponsorsState extends EntityState<Sponsor, string> {}

@Injectable({
  providedIn: 'root',
})
@StoreConfig({ name: 'sponsors', idKey: '_id' })
export class SponsorsStore extends EntityStore<SponsorsState> {
  constructor() {
    super();
  }
}
