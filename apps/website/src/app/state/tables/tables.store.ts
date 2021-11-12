import { Injectable } from '@angular/core';
import {
  ActiveState,
  EntityState,
  EntityStore,
  StoreConfig,
} from '@datorama/akita';
import { HvwTable } from '@svv/core/models';

export interface TablesState
  extends EntityState<HvwTable, string>,
    ActiveState {}

@Injectable({
  providedIn: 'root',
})
@StoreConfig({ name: 'tables', idKey: 'classId' })
export class TablesStore extends EntityStore<TablesState> {
  constructor() {
    super({
      loading: true,
    });
  }
}
