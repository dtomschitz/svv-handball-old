import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HvwTable } from '@svv/core/models';
import { HvwService } from './hvw.service';

@Injectable()
export class HvwTablesService extends HvwService {
  private readonly featureKey = 'tables';

  constructor(http: HttpClient) {
    super(http);
  }

  /**
   * Constructs a `GET` request that tries to retrieve all `Tables` from the API.
   *
   * @returns The received `Tables`.
   */
  getTables() {
    return this.http.get<HvwTable[]>(`${this.apiUrl}/hvw/${this.featureKey}`);
  }

  /**
   * Constructs a `DELETE` request that tries to delete all `HVW Classes` from
   * the database.
   */
  deleteTables() {
    return this.http.delete(`${this.apiUrl}/hvw/${this.featureKey}`);
  }
}
