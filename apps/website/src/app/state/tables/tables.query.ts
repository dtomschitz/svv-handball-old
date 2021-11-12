import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { TablesState, TablesStore } from './tables.store';

@Injectable({
  providedIn: 'root',
})
export class TablesQuery extends QueryEntity<TablesState> {
  constructor(protected store: TablesStore) {
    super(store);
  }

  selectCurrentTeamTable(classId: string) {
    return this.selectEntity(table => table.classId === classId);
  }
}
