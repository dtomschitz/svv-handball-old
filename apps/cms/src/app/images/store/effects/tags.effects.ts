import { Injectable } from '@angular/core';
import { Actions } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { createGenericEffect } from '@svv/cms/core/store/effects';
import { ImageTagsService } from '@svv/cms/images/services';
import { ImageTagsActions } from '@svv/cms/images/store/actions';
import * as fromImages from '@svv/cms/images/store/reducers';

@Injectable()
export class ImageTagsEffects {
  /**
   * This effect listens to the `loadImageTags` action and will try to fetch all
   * `Image Tags` from the API. In case the `Image Tags` have been already loaded
   * and stored in the state, the effect will use the cached `Image Tags` instead
   * of loading the data from the database each time.
   *
   * In case the `Image Tags` have been fetched successfully from the respective
   * endpoint in the API, the action `loadImageTagsSuccess` containg the received
   * `Image Tags` will be dispatched. Otherwise if an error occured while loading,
   * the `loadImageTagsFailure` action gets dispatched.
   */
  loadImageTag$ = createGenericEffect(
    this.actions$,
    ImageTagsActions.loadImageTags,
    () => this.imageTagsService.getImageTags(),
    () => ({
      success: tags => ImageTagsActions.loadImageTagsSuccess({ tags }),
      failure: () => ImageTagsActions.loadImageTagsFailure(),
      cache: () => ImageTagsActions.loadCachedImageTags(),
    }),
    {
      cachingSelector: this.store.select(fromImages.selectIsImageTagsLoaded),
    },
  )();

  /**
   * This effect listens to the `refreshImageTags` action and will try to fetch
   * all `Image Tag` from the API. In contrast to the `loadImageTags` effect,
   * this one will not try to look up into the cache to check if the `Image Tags`
   * have been loaded already.
   *
   * In case the `Image Tags` have been fetched successfully from the respective
   * endpoint in the API, the action `loadImageTagsSuccess` containg the received
   * `Image Tags` will be dispatched. Otherwise if an error occured while loading,
   * the `loadImageTagsFailure` action gets dispatched.
   */
  refreshImageTags$ = createGenericEffect(
    this.actions$,
    ImageTagsActions.refreshImageTags,
    () => this.imageTagsService.getImageTags(),
    () => ({
      success: tags => ImageTagsActions.loadImageTagsSuccess({ tags }),
      failure: () => ImageTagsActions.loadImageTagsFailure(),
    }),
  )();

  constructor(
    private actions$: Actions,
    private store: Store<fromImages.State>,
    private imageTagsService: ImageTagsService,
  ) {}
}
