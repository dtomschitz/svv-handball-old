import { Injectable } from '@angular/core';
import { Actions } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { createGenericEffect } from '@svv/cms/core/store/effects';
import { ImagesService } from '@svv/cms/images/services';
import { ImagesActions } from '@svv/cms/images/store/actions';
import * as fromImages from '@svv/cms/images/store/reducers';

@Injectable()
export class ImagesEffects {
  /**
   * This effect listens to the `loadImages` action and will try to fetch all
   * `Images` from the API. In case the `Images` have been already loaded
   * and stored in the state, the effect will use the cached `Images` instead
   * of loading the data from the database each time.
   *
   * In case the `Images` have been fetched successfully from the respective
   * endpoint in the API, the action `loadImagesSuccess` containg the received
   * `Images` will be dispatched. Otherwise if an error occured while loading,
   * the `loadImagesFailure` action gets dispatched.
   */
  loadImages$ = createGenericEffect(
    this.actions$,
    ImagesActions.loadImages,
    () => this.imagesService.getImages(),
    () => ({
      success: images => ImagesActions.loadImagesSuccess({ images }),
      failure: () => ImagesActions.loadImagesFailure(),
      cache: () => ImagesActions.loadImagesCache(),
    }),
    {
      cachingSelector: this.store.select(fromImages.selectIsImagesLoaded),
    },
  )();

  /**
   * This effect listens to the `refreshImages` action and will try to fetch
   * all `Images` from the API. In contrast to the `loadImages` effect,
   * this one will not try to look up into the cache to check if the `Images`
   * have been loaded already.
   *
   * In case the `Images` have been fetched successfully from the respective
   * endpoint in the API, the action `loadImagesSuccess` containg the received
   * `Images` will be dispatched. Otherwise if an error occured while loading,
   * the `loadImagesFailure` action gets dispatched.
   */
  refreshImages$ = createGenericEffect(
    this.actions$,
    ImagesActions.refreshImages,
    () => this.imagesService.getImages(),
    () => ({
      success: images => ImagesActions.loadImagesSuccess({ images }),
      failure: () => ImagesActions.loadImagesFailure(),
    }),
  )();

  constructor(
    private actions$: Actions,
    private store: Store<fromImages.State>,
    private imagesService: ImagesService,
  ) {}
}
