import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Update } from '@ngrx/entity';
import { environment } from '@svv/cms/environments/environment';
import { ArticleCategory } from '@svv/core/models';

@Injectable()
export class CategoriesService {
  private apiUrl = environment.apiUrl;
  private featureKey = 'articles/categories';

  constructor(private http: HttpClient) {}

  /**
   * Constructs a `GET` request that tries to retrieve all `Article Categories`
   * from the API.
   *
   * @returns The received `Article Categories`.
   */
  getCategories() {
    return this.http.get<ArticleCategory[]>(
      `${this.apiUrl}/${this.featureKey}`,
    );
  }

  /**
   * Constructs a `GET` request that tries to retrieve a `Article Category`
   * from the API which is associated with the given id.
   *
   * @param id The id of the `Article Category`.
   *
   * @returns The Article Category` who is associated with the given id.
   */
  getCategory(id: string) {
    return this.http.get<ArticleCategory>(
      `${this.apiUrl}/${this.featureKey}/${id}`,
    );
  }

  /**
   * Constructs a `POST` request that tries to create a new a `Article Category`
   * with the given parameters.
   *
   * @param user The object which contains the validated variables for creating
   * the new `Article Category`.
   *
   * @returns The newly created `Article Category`.
   */
  createCategory(category: Partial<ArticleCategory>) {
    return this.http.post<ArticleCategory>(
      `${this.apiUrl}/${this.featureKey}`,
      {
        category,
      },
    );
  }

  /**
   * Constructs a `PUT` request that tries to update a existing `Article Category`
   * with the given changes.
   *
   * @param update The object which contains the id of the `Article Category`
   * and the changes.
   *
   * @returns The updated Article Category`.
   */
  updateCategory(update: Update<ArticleCategory>) {
    return this.http.put<ArticleCategory>(
      `${this.apiUrl}/${this.featureKey}/${update.id}`,
      {
        changes: update.changes,
      },
    );
  }

  /**
   * Constructs a `DELETE` request that tries to delete the `Article Category`
   * which is associated with the given id.
   *
   * @param id The id of the `Article Category`.
   */
  deleteCategory(id: string) {
    return this.http.delete(`${this.apiUrl}/${this.featureKey}/${id}`);
  }
}
