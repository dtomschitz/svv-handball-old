import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EMPTY, timer } from 'rxjs';
import { catchError, delay, switchMap, tap } from 'rxjs/operators';
import { HvwSchedule } from '@svv/core/models';
import { environment } from '@svv/website/environments/environment';
import { SchedulesStore } from './schedules.store';
import { SchedulesQuery } from './schedules.query';

@Injectable({
  providedIn: 'root',
})
export class SchedulesService {
  private readonly apiUrl = environment.apiUrl;

  constructor(
    private store: SchedulesStore,
    private query: SchedulesQuery,
    private http: HttpClient,
  ) {}

  getSchedule(id: string) {
    if (this.query.hasEntity(id)) {
      this.store.setActive(id);
      this.store.setError(undefined);
      return EMPTY;
    }

    this.store.setLoading(true);
    return timer(500).pipe(
      switchMap(() =>
        this.http.get<HvwSchedule>(`${this.apiUrl}/hvw/schedules/${id}`),
      ),
      tap(schedule => {
        this.store.add(schedule, { loading: false });
        this.store.setError(undefined);
        this.store.setActive(id);
      }),
      catchError(response => {
        this.store.setLoading(false);
        this.store.setError(response.error);
        return EMPTY;
      }),
    );
  }
}
