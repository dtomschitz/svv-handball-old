import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { delay, map, switchMap, tap, withLatestFrom } from 'rxjs/operators';
import { Team } from '@svv/core/models';
import { environment } from '@svv/website/environments/environment';
import { TeamsStore } from './teams.store';
import { TeamsQuery } from './teams.query';
import { EMPTY, of } from 'rxjs';
import { arrayAdd } from '@datorama/akita';

@Injectable({
  providedIn: 'root',
})
export class TeamsService {
  private readonly apiUrl = environment.apiUrl;

  constructor(
    private store: TeamsStore,
    private teamsQuery: TeamsQuery,
    private http: HttpClient,
  ) {}

  getTeams() {
    return this.http
      .get<Team[]>(`${this.apiUrl}/teams/minimal`)
      .pipe(tap(teams => this.store.set(teams)));
  }

  getTeam(abbreviation: string) {
    return of(abbreviation).pipe(
      withLatestFrom(this.teamsQuery.selectLoadedTeams()),
      switchMap(([, loadedTeams]) => {
        if (loadedTeams.includes(abbreviation)) {
          return EMPTY;
        }

        return this.http.get<Team>(`${this.apiUrl}/teams/${abbreviation}`).pipe(
          delay(250),
          map(team => {
            this.store.upsert(team._id, team);
            this.store.update(state => ({
              ...state,
              loadedTeams: arrayAdd(state.loadedTeams, abbreviation),
            }));
          }),
        );
      }),
    );
  }
}
