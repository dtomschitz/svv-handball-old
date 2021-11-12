import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { switchMap } from 'rxjs/operators';
import { TeamsQuery } from '@svv/website/state/teams';
import { SchedulesState, SchedulesStore } from './schedules.store';

@Injectable({
  providedIn: 'root',
})
export class SchedulesQuery extends QueryEntity<SchedulesState> {
  selectCurrentSchedule$ = this.teamsQuery
    .selectCurrentTeamClassId()
    .pipe(switchMap(classId => this.selectEntity(classId)));

  constructor(protected store: SchedulesStore, private teamsQuery: TeamsQuery) {
    super(store);
  }
}
