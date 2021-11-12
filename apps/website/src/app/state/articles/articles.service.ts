import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EMPTY } from 'rxjs';
import { catchError, delay, tap } from 'rxjs/operators';
import { Article, ArticlesResponse } from '@svv/core/models';
import { environment } from '@svv/website/environments/environment';
import { ArticlesStore } from './articles.store';

@Injectable({
  providedIn: 'root',
})
export class ArticlesService {
  private readonly apiUrl = environment.apiUrl;

  constructor(private store: ArticlesStore, private http: HttpClient) {}

  getPinnedArticles() {
    return this.http.get<Article[]>(`${this.apiUrl}/articles?pinned=true`).pipe(
      delay(250),
      tap(articles => {
        this.store.add(articles);
      }),
      catchError(() => {
        return EMPTY;
      }),
    );
  }

  getArticles(initial: boolean, limit: number, categoryId?: string) {
    const skip = this.store.getValue().currentLimit;
    const url = `${this.apiUrl}/articles?skip=${skip}&limit=${limit}&checkNext=true`;

    if (initial) {
      this.store.reset();
    }

    this.store.setLoading(true);

    return this.http
      .get<ArticlesResponse>(categoryId ? `${url}&category=${categoryId}` : url)
      .pipe(
        delay(500),
        tap(response => {
          if (response.articles.length !== 0) {
            this.store.add(response.articles);
            this.store.update(state => ({
              ...state,
              currentLimit: state.currentLimit + limit,
              hasMore: response.hasMore,
            }));
          }
          this.store.update(state => ({ ...state, loading: false }));
        }),
        catchError(response => {
          this.store.setLoading(false);
          this.store.setError(response.error);
          return EMPTY;
        }),
      );
  }
}
