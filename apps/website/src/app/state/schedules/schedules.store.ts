import { Injectable } from '@angular/core';
import {
  ActiveState,
  EntityState,
  EntityStore,
  StoreConfig,
} from '@datorama/akita';
import { HvwSchedule } from '@svv/core/models';

export interface SchedulesState
  extends EntityState<HvwSchedule, string>,
    ActiveState {}

@Injectable({
  providedIn: 'root',
})
@StoreConfig({ name: 'schedules', idKey: 'classId' })
export class SchedulesStore extends EntityStore<SchedulesState> {
  constructor() {
    super({
      loading: true,
    });
  }
}
