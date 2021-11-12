import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Update } from '@ngrx/entity';
import { environment } from '@svv/cms/environments/environment';
import { Image } from '@svv/core/models';

@Injectable()
export class ImagesService {
  private readonly featureKey = 'images';
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  /**
   * Constructs a `GET` request that tries to retrieve all `Images` from the API.
   *
   * @returns The received `Images`.
   */
  getImages() {
    return this.http.get<Image[]>(`${this.apiUrl}/${this.featureKey}`);
  }

  /**
   * Constructs a `POST` request that tries to create a new a `Images` with the
   * given parameters.
   *
   * @param image The object which contains the validated variables for creating
   * the new `Image`.
   *
   * @returns The newly created `Images`.
   */
  createImage(image: Partial<Image>, file: File) {
    const formData = new FormData();
    formData.append('image', JSON.stringify(image));
    formData.append('file', file);

    return this.http.post<Image>(`${this.apiUrl}/${this.featureKey}`, formData);
  }

  /**
   * Constructs a `PUT` request that tries to update a existing `Images` with
   * the given changes.
   *
   * @param update The object which contains the id of the `Images`
   * and the changes.
   *
   * @returns The updated `Images`.
   */
  updateImage(update: Update<Image>) {
    return this.http.put<Image>(
      `${this.apiUrl}/${this.featureKey}/${update.id}`,
      {
        changes: update.changes,
      },
    );
  }

  /**
   * Constructs a `DELETE` request that tries to delete the `Images` which is
   * associated with the given id.
   *
   * @param id The id of the `Images`.
   */
  deleteImage(id: string) {
    return this.http.delete(`${this.apiUrl}/${this.featureKey}/${id}`);
  }
}
