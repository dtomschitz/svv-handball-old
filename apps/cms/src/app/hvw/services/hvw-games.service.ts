import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HvwGame } from '@svv/core/models';
import { HvwService } from './hvw.service';

@Injectable()
export class HvwGamesService extends HvwService {
  private readonly featureKey = 'games';

  constructor(http: HttpClient) {
    super(http);
  }

  /**
   * Constructs a `GET` request that tries to retrieve all `Games` from the API.
   *
   * @returns The received `Games`.
   */
  getGames() {
    return this.http.get<HvwGame[]>(`${this.apiUrl}/hvw/${this.featureKey}`);
  }

  /**
   * Constructs a `DELETE` request that tries to delete all `HVW Games` from
   * the database.
   */
  deleteGames() {
    return this.http.delete(`${this.apiUrl}/hvw/${this.featureKey}`);
  }
}
