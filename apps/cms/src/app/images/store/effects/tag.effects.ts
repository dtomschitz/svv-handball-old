import { Injectable } from '@angular/core';
import { HotToastService } from '@ngneat/hot-toast';
import { Actions } from '@ngrx/effects';
import { createGenericEffect } from '@svv/cms/core/store/effects';
import { ImageTagActions } from '@svv/cms/images/store/actions';
import { ImageTagsService } from '@svv/cms/images/services';

@Injectable()
export class ImageTagEffects {
  /**
   * This effect listens to the `createImageTag` action and will try to create
   * a new `Image Tag` based on the payload of the action.
   *
   * In case the `Image Tag` has been created successfully by the respective
   * endpoint in the API, the action `createImageTagSuccess` containg the newly
   * created `Image Tag` will be dispatched. Otherwise if an error occured while
   * creating, the `createImageTagFailure` action gets dispatched.
   */
  createImageTag$ = createGenericEffect(
    this.actions$,
    ImageTagActions.createImageTag,
    action => this.imageTagsService.createImageTag(action.tag),
    () => ({
      success: tag => ImageTagActions.createImageTagSuccess({ tag }),
      failure: () => ImageTagActions.createImageTagFailure(),
    }),
  )(this.toastService);

  /**
   * This effect listens to the `updateImageTag` action and will try to update a
   * existing `Image Tag` with the changes stored inside the payload of the action.
   *
   * In case the `Image Tag` has been updated successfully by the respective
   * endpoint in the API, the action `updateImageTagSuccess` containg the update
   * from the `updateImageTag` action will be dispatched. Otherwise if an error
   * occured while updating, the `updateImageTagFailure` action gets dispatched.
   */
  updateImageTag$ = createGenericEffect(
    this.actions$,
    ImageTagActions.updateImageTag,
    ({ update }) => this.imageTagsService.updateImageTag(update),
    ({ update }) => ({
      success: () => ImageTagActions.updateImageTagSuccess({ update }),
      failure: () => ImageTagActions.updateImageTagFailure(),
    }),
  )(this.toastService);

  /**
   * This effect listens to the `deleteImageTag` action and will try to delete a
   * existing `Image Tag` based on the id which stored in the payload of the action.
   *
   * In case the `Image Tag` has been deleted successfully by the respective
   * endpoint in the API, the action `deleteImageTagSuccess` containg the id
   * from the `deleteImageTag` action will be dispatched. Otherwise if an error
   * occured while deleting, the `deleteImageTagFailure` action gets dispatched.
   */
  deleteImageTag$ = createGenericEffect(
    this.actions$,
    ImageTagActions.deleteImageTag,
    ({ id }) => this.imageTagsService.deleteImageTag(id),
    ({ id }) => ({
      success: () => ImageTagActions.deleteImageTagSuccess({ id }),
      failure: () => ImageTagActions.deleteImageTagFailure(),
    }),
  )(this.toastService);

  constructor(
    private actions$: Actions,
    private imageTagsService: ImageTagsService,
    private toastService: HotToastService,
  ) {}
}
