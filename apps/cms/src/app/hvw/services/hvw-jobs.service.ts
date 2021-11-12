import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Update } from '@ngrx/entity';
import { HvwJob } from '@svv/core/models';
import { environment } from '@svv/cms/environments/environment';

@Injectable()
export class HvwJobsService {
  private apiUrl = environment.apiUrl;
  private readonly featureKey = 'jobs';

  constructor(private http: HttpClient) {}

  /**
   * Constructs a `GET` request that tries to retrieve all `HvwJobs` from the API.
   *
   * @returns The received `HvwJobs`.
   */
  getJobs() {
    return this.http.get<HvwJob[]>(`${this.apiUrl}/hvw/${this.featureKey}`);
  }

  /**
   * Constructs a `POST` request that tries to create a new a `CronJob` with the
   * given parameters.
   *
   * @param job The object which contains the validated variables for creating
   * the new `CronJob`.
   *
   * @returns The newly created `CronJob`.
   */
  createJob(job: Partial<HvwJob>) {
    return this.http.post<HvwJob>(`${this.apiUrl}/hvw/${this.featureKey}`, {
      job,
    });
  }

  /**
   * Constructs a `PUT` request that tries to update a existing `CronJob` with
   * the given changes.
   *
   * @param update The object which contains the id of the `CronJob`
   * and the changes.
   *
   * @returns The updated CronJob`.
   */
  updateJob({ id, changes }: Update<HvwJob>) {
    return this.http.put<HvwJob>(
      `${this.apiUrl}/hvw/${this.featureKey}/${id}`,
      {
        changes,
      },
    );
  }

  /**
   * Constructs a `DELETE` request that tries to delete the `CronJob` which is
   * associated with the given id.
   *
   * @param id The id of the `CronJob`.
   */
  deleteJob(id: string) {
    return this.http.delete(`${this.apiUrl}/hvw/${this.featureKey}/${id}`);
  }
}
