import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HvwWeek } from '@svv/core/models';
import { HvwService } from './hvw.service';

@Injectable()
export class HvwWeeksService extends HvwService {
  private readonly featureKey = 'weeks';

  constructor(http: HttpClient) {
    super(http);
  }

  /**
   * Constructs a `GET` request that tries to retrieve all `Weeks` from the API.
   *
   * @returns The received `Weeks`.
   */
  getWeeks() {
    return this.http.get<HvwWeek[]>(`${this.apiUrl}/hvw/${this.featureKey}`);
  }

  /**
   * Constructs a `DELETE` request that tries to delete all `HVW Weeks` from
   * the database.
   */
  deleteWeeks() {
    return this.http.delete(`${this.apiUrl}/hvw/${this.featureKey}`);
  }
}
