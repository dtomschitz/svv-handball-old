import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EMPTY, timer } from 'rxjs';
import { catchError, delay, switchMap, tap } from 'rxjs/operators';
import { HvwTable } from '@svv/core/models';
import { environment } from '@svv/website/environments/environment';
import { TablesStore } from './tables.store';
import { TablesQuery } from './tables.query';

@Injectable({
  providedIn: 'root',
})
export class TablesService {
  private readonly apiUrl = environment.apiUrl;

  constructor(
    private store: TablesStore,
    private query: TablesQuery,
    private http: HttpClient,
  ) {}

  getTable(id: string) {
    if (this.query.hasEntity(id)) {
      this.store.setActive(id);
      this.store.setError(undefined);
      return EMPTY;
    }

    this.store.setLoading(true);
    return timer(500).pipe(
      switchMap(() =>
        this.http.get<HvwTable>(`${this.apiUrl}/hvw/tables/${id}`),
      ),
      tap(table => {
        this.store.add(table, { loading: false });
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
