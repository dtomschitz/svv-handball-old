import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DashboardInfo, ServiceStatus, Service } from '@svv/core/models';
import { environment } from '@svv/cms/environments/environment';
import { catchError, map } from 'rxjs/operators';
import { forkJoin, Observable, of } from 'rxjs';

@Injectable()
export class DashboardService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getDashboardInfo() {
    return this.http.get<DashboardInfo>(`${this.apiUrl}/info`);
  }

  getServices(): Observable<Service[]> {
    const call = (name: string, url: string): Observable<Service> => {
      return this.http.get(url).pipe(
        map(() => ({
          name,
          status: ServiceStatus.OPERATIONAL,
        })),
        catchError(() =>
          of({
            name,
            status: ServiceStatus.DOWN,
          }),
        ),
      );
    };

    return forkJoin([
      call('NGINX Server', 'http://localhost:6379'),
      call('Redis Server', 'http://localhost:6379/ping'),
      call('SV Vaihingen Database', 'http://localhost:27017'),
      call('SV Vaihingen API', 'https://api.svv-handball.de'),
      call('SV Vaihingen Website', 'https://www.svv-handball.de'),
    ]);
  }
}
