import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@svv/cms/environments/environment';
import { Article } from '@svv/core/models';
import { Update } from '@ngrx/entity';

@Injectable()
export class ArticlesService {
  private apiUrl = environment.apiUrl;
  private featureKey = 'articles';

  constructor(private http: HttpClient) {}

  /**
   * Constructs a `GET` request that tries to retrieve all `Articles` from the API.
   *
   * @returns The received `Articles`.
   */
  getArticles() {
    return this.http.get<Article[]>(`${this.apiUrl}/${this.featureKey}`);
  }

  /**
   * Constructs a `GET` request that tries to retrieve a `Article` from the API
   * which is associated with the given id.
   *
   * @param id The id of the `Article`.
   *
   * @returns The Article` who is associated with the given id.
   */
  getArticle(id: string) {
    return this.http.get<Article>(`${this.apiUrl}/${this.featureKey}/${id}`);
  }

  /**
   * Constructs a `POST` request that tries to create a new a `Article` with the
   * given parameters.
   *
   * @param user The object which contains the validated variables for creating
   * the new `Article`.
   *
   * @returns The newly created `Article`.
   */
  createArticle(article: Partial<Article>) {
    return this.http.post<Article>(`${this.apiUrl}/${this.featureKey}`, {
      article,
    });
  }

  /**
   * Constructs a `PUT` request that tries to update a existing `Article` with
   * the given changes.
   *
   * @param update The object which contains the id of the `Article`
   * and the changes.
   *
   * @returns The updated Article`.
   */
  updateArticle(update: Update<Article>) {
    return this.http.put<Article>(
      `${this.apiUrl}/${this.featureKey}/${update.id}`,
      {
        changes: update.changes,
      },
    );
  }

  /**
   * Constructs a `DELETE` request that tries to delete the `Article` which is
   * associated with the given id.
   *
   * @param id The id of the `Article`.
   */
  deleteArticle(id: string) {
    return this.http.delete(`${this.apiUrl}/${this.featureKey}/${id}`);
  }
}
