import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HvwCachingResult, HvwCachingType } from '@svv/core/models';
import { environment } from '@svv/cms/environments/environment';

@Injectable()
export class HvwService {
  protected apiUrl = environment.apiUrl;

  constructor(public readonly http: HttpClient) {}

  /**
   * Constructs a `GET` request that tries to retrieve all `CachingResults`
   * from the API.
   *
   * @param type The type of `Caching Results` that should be received.
   *
   * @returns The received `Caching Results`.
   */
  getCachingResults(type: HvwCachingType) {
    return this.http.get<HvwCachingResult[]>(
      `${this.apiUrl}/hvw/cache/${type}/results`,
    );
  }

  /**
   * Starts the caching process of for the given `Caching Type`.
   *
   * @param type The `Caching Type`.
   * @param userId The id of the `User` who started the caching process.
   *
   * @returns The results for started caching process.
   */
  cache(type: HvwCachingType, userId: string) {
    return this.http.post<HvwCachingResult>(
      `${this.apiUrl}/hvw/cache/${type}`,
      {
        userId,
      },
    );
  }
}
