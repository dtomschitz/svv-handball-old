import { Injectable } from '@angular/core';
import { Order, QueryConfig, QueryEntity } from '@datorama/akita';
import { SponsorsState, SponsorsStore } from './sponsors.store';

@QueryConfig({
  sortBy: 'position',
  sortByOrder: Order.ASC,
})
@Injectable({
  providedIn: 'root',
})
export class SponsorsQuery extends QueryEntity<SponsorsState> {
  constructor(protected store: SponsorsStore) {
    super(store);
  }

  selectSponsors() {
    return this.selectAll({
      filterBy: [sponsor => !sponsor?.disabled],
    });
  }
}
