import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, delay, map, switchMap } from 'rxjs/operators';
import { createGenericEffect } from '@svv/cms/core/store/effects';
import { CategoriesService } from '@svv/cms/articles/services';
import { CategoriesActions } from '@svv/cms/articles/store/actions';
import * as fromArticles from '@svv/cms/articles/store/reducers';

@Injectable()
export class CategoriesEffects {
  /**
   * This effect listens to the `loadCategories` action and will try to fetch
   * all `Article Categories` from the API. In case the `Article Categories`
   * have been already loaded and stored in the state, the effect will use the
   * cached `Articles` instead of loading the data from the database each time.
   *
   * In case the `Article Categories` have been fetched successfully from the
   * respective endpoint in the API, the action `loadCategoriesSuccess` containg
   * the received `Article Categories` will be dispatched. Otherwise if an error
   * occured while loading, the `loadCategoriesFailure` action gets dispatched.
   */
  loadArticles$ = createGenericEffect(
    this.actions$,
    CategoriesActions.loadCategories,
    () => this.categoriesService.getCategories(),
    () => ({
      success: categories =>
        CategoriesActions.loadCategoriesSuccess({ categories }),
      failure: () => CategoriesActions.loadCategoriesFailure(),
      cache: () => CategoriesActions.loadCategoriesCache(),
    }),
    {
      cachingSelector: this.store.select(
        fromArticles.selectIsArticleCategoriesLoaded,
      ),
    },
  )();

  /**
   * This effect listens to the `refreshCategories` action and will try to fetch
   * all `Article Categories` from the API. In contrast to the `loadCategories`
   * effect, this one will not try to look up into the cache to check if the
   * `Article Categories` have been loaded already.
   *
   * In case the `Article Categories` have been fetched successfully from the
   * respective endpoint in the API, the action `loadCategoriesSuccess` containg
   * the received `Article Categories` will be dispatched. Otherwise if an error
   * occured while loading, the `loadCategoriesFailure` action gets dispatched.
   */
  refreshCategories$ = createGenericEffect(
    this.actions$,
    CategoriesActions.refreshCategories,
    () => this.categoriesService.getCategories(),
    () => ({
      success: categories =>
        CategoriesActions.loadCategoriesSuccess({ categories }),
      failure: () => CategoriesActions.loadCategoriesFailure(),
    }),
  )();

  constructor(
    private actions$: Actions,
    private store: Store<fromArticles.State>,
    private categoriesService: CategoriesService,
  ) {}
}
