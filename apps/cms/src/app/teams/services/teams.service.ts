import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Update } from '@ngrx/entity';
import { Team } from '@svv/core/models';
import { environment } from '@svv/cms/environments/environment';

@Injectable()
export class TeamsService {
  private apiUrl = environment.apiUrl;
  private featureKey = 'teams';

  constructor(private http: HttpClient) {}

  /**
   * Constructs a `GET` request that tries to retrieve all `Teams` from the API.
   *
   * @returns The received `Teams`.
   */
  getTeams() {
    return this.http.get<Team[]>(`${this.apiUrl}/${this.featureKey}`);
  }

  /**
   * Constructs a `GET` request that tries to retrieve a `Team` from the API
   * which is associated with the given id.
   *
   * @param id The id of the `Team`.
   *
   * @returns The User` who is associated with the given id.
   */
  getTeam(id: string) {
    return this.http.get<Team>(`${this.apiUrl}/${this.featureKey}/${id}`);
  }

  /**
   * Constructs a `POST` request that tries to create a new a `Team` with the
   * given parameters.
   *
   * @param user The object which contains the validated variables for creating
   * the new `Team`.
   *
   * @returns The newly created `User`.
   */
  createTeam(team: Partial<Team>) {
    return this.http.post<Team>(`${this.apiUrl}/${this.featureKey}`, {
      team,
    });
  }

  /**
   * Constructs a `PUT` request that tries to update a existing `Team` with the
   * given changes.
   *
   * @param update The object which contains the id of the `Team` and the changes.
   *
   * @returns The updated User`.
   */
  updateTeam(update: Update<Team>) {
    return this.http.put<Team>(
      `${this.apiUrl}/${this.featureKey}/${update.id}`,
      {
        changes: update.changes,
      },
    );
  }

  /**
   * Constructs a `PUT` request that tries to update a list of `Teams` with the
   * respective changes.
   *
   * @param updates The object which contains the ids of the `Teams` and
   * the changes.
   */
  updateTeams(updates: Update<Team>[]) {
    return this.http.put(`${this.apiUrl}/${this.featureKey}`, { updates });
  }

  /**
   * Constructs a `POST` request that tries to upload the new image for the
   * `Team` to the backend.
   *
   * @param id The id of the `Team`.
   * @param image The image which should be uploaded.
   *
   * @returns The updated `Team`.
   */
  uploadTeamImage(id: string, image: File) {
    const uploadData = new FormData();
    uploadData.append('image', image);

    return this.http.post<Update<Team>>(
      `${this.apiUrl}/${this.featureKey}/${id}/image`,
      uploadData,
    );
  }

  /**
   * Constructs a `DELETE` request that tries to delete the images which are
   * associated with the `Team`.
   *
   * @param id The id of the `Team`.
   */
  deleteTeamImage(id: string) {
    return this.http.delete(`${this.apiUrl}/${this.featureKey}/${id}/image`);
  }

  /**
   * Constructs a `DELETE` request that tries to delete the `Team` which is
   * associated with the given id.
   *
   * @param id The id of the `Team`.
   */
  deleteTeam(id: string) {
    return this.http.delete(`${this.apiUrl}/${this.featureKey}/${id}`);
  }
}
