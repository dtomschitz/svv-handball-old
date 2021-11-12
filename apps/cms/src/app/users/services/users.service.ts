import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Update } from '@ngrx/entity';
import { User } from '@svv/core/models';
import { environment } from '@svv/cms/environments/environment';

@Injectable()
export class UsersService {
  private apiUrl = environment.apiUrl;
  private featureKey = 'users';

  constructor(private http: HttpClient) {}

  /**
   * Constructs a `GET` request that tries to retrieve all `Users` from the API.
   *
   * @returns The received `Users`.
   */
  getUsers() {
    return this.http.get<User[]>(`${this.apiUrl}/${this.featureKey}`);
  }

  /**
   * Constructs a `GET` request that tries to retrieve a `User` from the API
   * which is associated with the given id.
   *
   * @param id The id of the `User`.
   *
   * @returns The User` who is associated with the given id.
   */
  getUser(id: string) {
    return this.http.get<User>(`${this.apiUrl}/${this.featureKey}/${id}`);
  }

  /**
   * Constructs a `POST` request that tries to create a new a `User` with the
   * given parameters.
   *
   * @param user The object which contains the validated variables for creating
   * the new `User`.
   *
   * @returns The newly created `User`.
   */
  createUser(user: Partial<User>) {
    return this.http.post<User>(`${this.apiUrl}/${this.featureKey}`, {
      user,
    });
  }

  /**
   * Constructs a `PUT` request that tries to update a existing `User` with the
   * given changes.
   *
   * @param update The object which contains the id of the `User` and the changes.
   *
   * @returns The updated User`.
   */
  updateUser(update: Update<User>) {
    return this.http.put<User>(
      `${this.apiUrl}/${this.featureKey}/${update.id}`,
      {
        changes: update.changes,
      },
    );
  }

  /**
   * Constructs a `DELETE` request that tries to delete the `User` which is
   * associated with the given id.
   *
   * @param id The id of the `User`.
   */
  deleteUser(id: string) {
    return this.http.delete(`${this.apiUrl}/${this.featureKey}/${id}`);
  }
}
