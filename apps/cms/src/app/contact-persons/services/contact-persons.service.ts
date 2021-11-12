import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@svv/cms/environments/environment';
import { ContactPerson } from '@svv/core/models';
import { Update } from '@ngrx/entity';

@Injectable()
export class ContactPersonsService {
  private apiUrl = environment.apiUrl;
  private featureKey = 'contact-persons';

  constructor(private http: HttpClient) {}

  /**
   * Constructs a `GET` request that tries to retrieve all `Contact Persons`
   * from the API.
   *
   * @returns The received `Contact Persons`.
   */
  getContactPersons() {
    return this.http.get<ContactPerson[]>(`${this.apiUrl}/${this.featureKey}`);
  }

  /**
   * Constructs a `POST` request that tries to create a new a `Contact Person`
   * with the given parameters.
   *
   * @param contactPerson The object which contains the validated variables for
   * creating the new `Contact Person`.
   *
   * @returns The newly created `Contact Person`.
   */
  createContactPerson(contactPerson: Partial<ContactPerson>) {
    return this.http.post<ContactPerson>(`${this.apiUrl}/${this.featureKey}`, {
      contactPerson,
    });
  }

  /**
   * Constructs a `PUT` request that tries to update a existing `Contact Person`
   * with the given changes.
   *
   * @param update The object which contains the id of the `Contact Person`
   * and the changes.
   *
   * @returns The updated `Contact Person`.
   */
  updateContactPerson(update: Update<ContactPerson>) {
    return this.http.put<ContactPerson>(
      `${this.apiUrl}/${this.featureKey}/${update.id}`,
      {
        changes: update.changes,
      },
    );
  }

  /**
   * Constructs a `PUT` request that tries to update a list of `Contact Persons`
   * with the respective changes.
   *
   * @param updates The object which contains the ids of the `Contact Persons`
   * and the changes.
   */
  updateContactPersons(updates: Update<ContactPerson>[]) {
    return this.http.put(`${this.apiUrl}/${this.featureKey}`, {
      updates,
    });
  }

  /**
   * Constructs a `DELETE` request that tries to delete the `Contact Person`
   * which is associated with the given id.
   *
   * @param id The id of the `Contact Person`.
   */
  deleteContactPerson(id: string) {
    return this.http.delete(`${this.apiUrl}/${this.featureKey}/${id}`);
  }
}
