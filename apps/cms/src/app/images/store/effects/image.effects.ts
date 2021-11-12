import { Injectable } from '@angular/core';
import { HotToastService } from '@ngneat/hot-toast';
import { Actions } from '@ngrx/effects';
import { createGenericEffect } from '@svv/cms/core/store/effects';
import { ImageActions } from '@svv/cms/images/store/actions';
import { ImagesService } from '@svv/cms/images/services';

@Injectable()
export class ImageEffects {
  /**
   * This effect listens to the `createImage` action and will try to create
   * a new `Image` based on the payload of the action.
   *
   * In case the `Image` has been created successfully by the respective
   * endpoint in the API, the action `createImageSuccess` containg the newly
   * created `Image` will be dispatched. Otherwise if an error occured while
   * creating, the `createImageFailure` action gets dispatched.
   */
  createImage$ = createGenericEffect(
    this.actions$,
    ImageActions.createImage,
    action => this.imagesService.createImage(action.image, action.file),
    () => ({
      success: image => ImageActions.createImageSuccess({ image }),
      failure: () => ImageActions.createImageFailure(),
    }),
  )(this.toastService);

  /**
   * This effect listens to the `updateImage` action and will try to update a
   * existing `Image` with the changes stored inside the payload of the action.
   *
   * In case the `Image` has been updated successfully by the respective
   * endpoint in the API, the action `updateImageSuccess` containg the update
   * from the `updateImage` action will be dispatched. Otherwise if an error
   * occured while updating, the `updateImageFailure` action gets dispatched.
   */
  updateImage$ = createGenericEffect(
    this.actions$,
    ImageActions.updateImage,
    ({ update }) => this.imagesService.updateImage(update),
    ({ update }) => ({
      success: () => ImageActions.updateImageSuccess({ update }),
      failure: () => ImageActions.updateImageFailure(),
    }),
  )(this.toastService);

  /**
   * This effect listens to the `deleteImage` action and will try to delete a
   * existing `Image` based on the id which stored in the payload of the action.
   *
   * In case the `Image` has been deleted successfully by the respective
   * endpoint in the API, the action `deleteImageSuccess` containg the id
   * from the `deleteImage` action will be dispatched. Otherwise if an error
   * occured while deleting, the `deleteImageFailure` action gets dispatched.
   */
  deleteImage$ = createGenericEffect(
    this.actions$,
    ImageActions.deleteImage,
    ({ id }) => this.imagesService.deleteImage(id),
    ({ id }) => ({
      success: () => ImageActions.deleteImageSuccess({ id }),
      failure: () => ImageActions.deleteImageFailure(),
    }),
  )(this.toastService);

  constructor(
    private actions$: Actions,
    private imagesService: ImagesService,
    private toastService: HotToastService,
  ) {}
}
