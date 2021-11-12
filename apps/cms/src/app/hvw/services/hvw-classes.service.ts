import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HvwClass } from '@svv/core/models';
import { HvwService } from './hvw.service';

@Injectable()
export class HvwClassesService extends HvwService {
  private readonly featureKey = 'classes';

  constructor(http: HttpClient) {
    super(http);
  }

  /**
   * Constructs a `GET` request that tries to retrieve all `Classes` from the API.
   *
   * @returns The received `Classes`.
   */
  getClasses() {
    return this.http.get<HvwClass[]>(`${this.apiUrl}/hvw/${this.featureKey}`);
  }

  /**
   * Constructs a `DELETE` request that tries to delete all `HVW Classes` from
   * the database.
   */
  deleteClasses() {
    return this.http.delete(`${this.apiUrl}/hvw/${this.featureKey}`);
  }
}
