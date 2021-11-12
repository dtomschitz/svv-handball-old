import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@svv/cms/environments/environment';
import { Sponsor } from '@svv/core/models';
import { Update } from '@ngrx/entity';

@Injectable()
export class SponsorsService {
  private apiUrl = environment.apiUrl;
  private featureKey = 'sponsors';

  constructor(private http: HttpClient) {}

  /**
   * Constructs a `GET` request that tries to retrieve all `Sponsors` from the API.
   *
   * @returns The received `Sponsors`.
   */
  getSponsors() {
    return this.http.get<Sponsor[]>(`${this.apiUrl}/${this.featureKey}`);
  }

  /**
   * Constructs a `GET` request that tries to retrieve a `Sponsor` from the API
   * which is associated with the given id.
   *
   * @param id The id of the `Sponsor`.
   *
   * @returns The `Sponsor` which is associated with the given id.
   */
  getSponsor(id: string) {
    return this.http.get<Sponsor>(`${this.apiUrl}/${this.featureKey}/${id}`);
  }

  /**
   * Constructs a `POST` request that tries to create a new a `Sponsor` with the
   * given parameters.
   *
   * @param sponsor The object which contains the validated variables for
   * creating the new `Sponsor`.
   *
   * @returns The newly created `Sponsor`.
   */
  createSponsor(sponsor: Partial<Sponsor>) {
    return this.http.post<Sponsor>(`${this.apiUrl}/${this.featureKey}`, {
      sponsor,
    });
  }

  /**
   * Constructs a `PUT` request that tries to update a existing `Sponsor` with
   * the given changes.
   *
   * @param update The object which contains the id of the `Sponsor`
   * and the changes.
   *
   * @returns The updated `Sponsor`.
   */
  updateSponsor(update: Update<Sponsor>) {
    return this.http.put<Sponsor>(
      `${this.apiUrl}/${this.featureKey}/${update.id}`,
      {
        changes: update.changes,
      },
    );
  }

  /**
   * Constructs a `PUT` request that tries to update a list of `Sponsors` with
   * the respective changes.
   *
   * @param updates The object which contains the ids of the `Sponsors` and
   * the changes.
   */
  updateSponsors(updates: Update<Sponsor>[]) {
    return this.http.put(`${this.apiUrl}/${this.featureKey}`, {
      updates,
    });
  }

  /**
   * Constructs a `POST` request that tries to upload the new image for the
   * `Sponsor` to the backend.
   *
   * @param id The id of the `Sponsor`.
   * @param image The image which should be uploaded.
   *
   * @returns The updated `Sponsor`.
   */
  uploadSponsorImage(id: string, image: File) {
    const uploadData = new FormData();
    uploadData.append('image', image);

    return this.http.post<Update<Sponsor>>(
      `${this.apiUrl}/${this.featureKey}/${id}/image`,
      uploadData,
    );
  }

  /**
   * Constructs a `DELETE` request that tries to delete the image which is
   * associated with the `Sponsor`.
   *
   * @param id The id of the `Sponsor`.
   */
  deleteSponsorImage(id: string) {
    return this.http.delete(`${this.apiUrl}/${this.featureKey}/${id}/image`);
  }

  /**
   * Constructs a `DELETE` request that tries to delete the `Sponsor` which is
   * associated with the given id.
   *
   * @param id The id of the `Sponsor`.
   */
  deleteSponsor(id: string) {
    return this.http.delete(`${this.apiUrl}/${this.featureKey}/${id}`);
  }
}
