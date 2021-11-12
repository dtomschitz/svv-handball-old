import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { cacheable } from '@datorama/akita';
import { tap } from 'rxjs/operators';
import { Sponsor } from '@svv/core/models';
import { environment } from '@svv/website/environments/environment';
import { SponsorsStore } from './sponsors.store';

@Injectable({
  providedIn: 'root',
})
export class SponsorsService {
  private readonly apiUrl = environment.apiUrl;

  constructor(private store: SponsorsStore, private http: HttpClient) {}

  getSponsors() {
    const request$ = this.http
      .get<Sponsor[]>(`${this.apiUrl}/sponsors`)
      .pipe(tap(sponsors => this.store.set(sponsors)));

    return cacheable(this.store, request$);
  }
}
