import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Update } from '@ngrx/entity';
import { environment } from '@svv/cms/environments/environment';
import { HvwTable, ImageTag } from '@svv/core/models';

@Injectable()
export class ImageTagsService {
  private readonly featureKey = 'images/tags';
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  /**
   * Constructs a `GET` request that tries to retrieve all `Image Tags` 
   * from the API.
   *
   * @returns The received `Image Tags`.
   */
  getImageTags() {
    return this.http.get<ImageTag[]>(`${this.apiUrl}/${this.featureKey}`);
  }

  /**
   * Constructs a `POST` request that tries to create a new a `Image Tag` with 
   * the iven parameters.
   *
   * @param tag The object which contains the validated variables for creating
   * the new `Image Tag`.
   *
   * @returns The newly created `Image Tag`.
   */
  createImageTag(tag: Partial<ImageTag>) {
    return this.http.post<ImageTag>(`${this.apiUrl}/${this.featureKey}`, {
      tag,
    });
  }

  /**
   * Constructs a `PUT` request that tries to update a existing `Image Tag` with 
   * the given changes.
   *
   * @param update The object which contains the id of the `Image Tag` 
   * and the changes.
   *
   * @returns The updated `Image Tag`.
   */
  updateImageTag(update: Update<ImageTag>) {
    return this.http.put<ImageTag>(
      `${this.apiUrl}/${this.featureKey}/${update.id}`,
      {
        changes: update.changes,
      },
    );
  }

  /**
   * Constructs a `DELETE` request that tries to delete the `Image Tag` which is
   * associated with the given id.
   *
   * @param id The id of the `Image Tag`.
   */
  deleteImageTag(id: string) {
    return this.http.delete(`${this.apiUrl}/${this.featureKey}/${id}`);
  }
}
