import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EMPTY } from 'rxjs';
import { catchError, delay, map, tap } from 'rxjs/operators';
import { GameWeek, HvwWeek } from '@svv/core/models';
import { environment } from '@svv/website/environments/environment';
import { GamesStore } from './games.store';
import { GamesQuery } from './games.query';

@Injectable({
  providedIn: 'root',
})
export class GamesService {
  private readonly apiUrl = environment.apiUrl;

  constructor(
    private store: GamesStore,
    private query: GamesQuery,
    private http: HttpClient,
  ) {}

  getGameWeek(week?: string, refresh?: boolean) {
    if (
      !refresh &&
      this.query.hasEntity(gameWeek => gameWeek.weeks.selected === week)
    ) {
      this.store.setActive(week);
      this.store.setError(undefined);
      return EMPTY;
    }

    this.store.setLoading(true);

    return this.http
      .get<GameWeek>(
        week
          ? `${this.apiUrl}/hvw/games/week/${week}`
          : `${this.apiUrl}/hvw/games/week`,
      )
      .pipe(
        delay(500),
        map(gameWeek => {
          this.store.setLoading(false);
          this.store.add(gameWeek);
          this.store.setActive(gameWeek._id);
        }),
        catchError(response => {
          this.store.setLoading(false);
          this.store.setError(response.error);
          return EMPTY;
        }),
      );
  }

  getWeeks() {
    return this.http.get<HvwWeek[]>(`${this.apiUrl}/hvw/weeks`).pipe(
      map(weeks => {
        this.store.update(state => ({
          ...state,
          weeks,
        }));
      }),
      catchError(response => EMPTY),
    );
  }
}
