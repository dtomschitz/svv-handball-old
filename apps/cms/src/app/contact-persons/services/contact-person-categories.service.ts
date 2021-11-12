import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@svv/cms/environments/environment';
import { ContactPerson, ContactPersonCategory } from '@svv/core/models';
import { Update } from '@ngrx/entity';

@Injectable()
export class ContactPersonCategoriesService {
  private apiUrl = environment.apiUrl;
  private featureKey = 'contact-persons/categories';

  constructor(private http: HttpClient) {}

  /**
   * Constructs a `GET` request that tries to retrieve all
   * `Contact Person Categories` from the API.
   *
   * @returns The received `Contact Person Categories`.
   */
  getCategories() {
    return this.http.get<ContactPersonCategory[]>(
      `${this.apiUrl}/${this.featureKey}`,
    );
  }

  /**
   * Constructs a `POST` request that tries to create a new a
   * `Contact Person Category`∂ with the given parameters.
   *
   * @param contactPerson The object which contains the validated variables for
   * creating the new `Contact Perso Category`.
   *
   * @returns The newly created `Contact Person Category`.
   */
  createCategory(category: Partial<ContactPersonCategory>) {
    return this.http.post<ContactPerson>(`${this.apiUrl}/${this.featureKey}`, {
      category,
    });
  }

  /**
   * Constructs a `PUT` request that tries to update a existing
   * `Contact Person Category` with the given changes.
   *
   * @param update The object which contains the id of the
   * `Contact Person Category` and the changes.
   *
   * @returns The updated `Contact Person Category`.
   */
  updateCategory(update: Update<ContactPersonCategory>) {
    return this.http.put<ContactPersonCategory>(
      `${this.apiUrl}/${this.featureKey}/${update.id}`,
      {
        changes: update.changes,
      },
    );
  }

  /**
   * Constructs a `PUT` request that tries to update a list of
   * `Contact Person Categories` with the respective changes.
   *
   * @param updates The object which contains the ids of the
   * `Contact Person Categories` and the changes.
   */
  updateCategories(updates: Update<ContactPersonCategory>[]) {
    return this.http.put(`${this.apiUrl}/${this.featureKey}`, {
      updates,
    });
  }

  /**
   * Constructs a `DELETE` request that tries to delete the
   * `Contact Person Category`  which is associated with the given id.
   *
   * @param id The id of the `Contact Person`.
   */
  deleteCategory(id: string) {
    return this.http.delete(`${this.apiUrl}/${this.featureKey}/${id}`);
  }
}
