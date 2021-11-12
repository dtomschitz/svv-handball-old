import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { RouterQuery } from '@datorama/akita-ng-router-store';
import { Gender, TeamType } from '@svv/core/models';
import { Observable } from 'rxjs';
import { filter, first, map, switchMap } from 'rxjs/operators';
import { TeamsState, TeamsStore } from './teams.store';

const initialValue = (length: number) => {
  return <T>(source: Observable<T>) => {
    return source.pipe(
      map(value => {
        if (Array.isArray(value) && value.length === 0) {
          return new Array(length);
        }

        return value;
      }),
    );
  };
};

@Injectable({
  providedIn: 'root',
})
export class TeamsQuery extends QueryEntity<TeamsState> {
  selectCurrentTeam$ = this.selectAll().pipe(
    switchMap(teams =>
      this.routerQuery
        .selectParams('abbreviation')
        .pipe(
          map(abbreviation =>
            teams.find(team => team.abbreviation === abbreviation),
          ),
        ),
    ),
  );

  selectActiveTeams$ = this.selectAll({
    filterBy: [team => team.type === TeamType.ACTIVE],
  }).pipe(initialValue(5));

  selectMaleYouthTeams$ = this.selectAll({
    filterBy: [
      team => team.type === TeamType.YOUTH,
      team => team.gender === Gender.MALE,
    ],
  }).pipe(initialValue(8));

  selectFemaleYouthTeams$ = this.selectAll({
    filterBy: [
      team => team.type === TeamType.YOUTH,
      team => team.gender === Gender.FEMALE,
    ],
  }).pipe(initialValue(5));

  selectMixedYouthTeams$ = this.selectAll({
    filterBy: [
      team => team.type === TeamType.YOUTH,
      team => team.gender === Gender.MIXED,
    ],
  }).pipe(initialValue(2));

  constructor(protected store: TeamsStore, private routerQuery: RouterQuery) {
    super(store);
  }

  selectCurrentTeamClassId() {
    return this.selectCurrentTeam$.pipe(
      filter(team => !!team),
      map(team => team.classId),
      first(),
    );
  }

  selectCurrentTeamArticleCategoryId() {
    return this.selectCurrentTeam$.pipe(
      filter(team => !!team),
      map(team => team.articleCategoryId),
      first(),
    );
  }

  selectLoadedTeams() {
    return this.select(state => state.loadedTeams);
  }
}
