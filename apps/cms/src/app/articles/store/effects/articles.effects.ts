import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map } from 'rxjs/operators';
import { UserActions } from '@svv/cms/users/store/actions';
import { ArticlesService } from '@svv/cms/articles/services';
import {
  ArticleActions,
  ArticlesActions,
  CategoryActions,
} from '@svv/cms/articles/store/actions';
import { createGenericEffect } from '@svv/cms/core/store/effects';
import * as fromArticles from '@svv/cms/articles/store/reducers';

@Injectable()
export class ArticlesEffects {
  /**
   * This effect listens to the `loadArticles` action and will try to fetch all
   * `Articles` from the API. In case the `Articles` have been already loaded
   * and stored in the state, the effect will use the cached `Articles` instead
   * of loading the data from the database each time.
   *
   * In case the `Articles` have been fetched successfully from the respective
   * endpoint in the API, the action `loadArticlesSuccess` containg the received
   * `Articles` will be dispatched. Otherwise if an error occured while loading,
   * the `loadArticlesFailure` action gets dispatched.
   */
  loadArticles$ = createGenericEffect(
    this.actions$,
    ArticlesActions.loadArticles,
    () => this.articlesService.getArticles(),
    () => ({
      success: articles => ArticlesActions.loadArticlesSuccess({ articles }),
      failure: () => ArticlesActions.loadArticlesFailure(),
      cache: () => ArticlesActions.loadArticlesCache(),
    }),
    {
      cachingSelector: this.store.select(fromArticles.selectIsArticlesLoaded),
    },
  )();

  /**
   * This effect listens to the `refreshArticles` action and will try to fetch
   * all `Articles` from the API. In contrast to the `loadArticles` effect, this
   * one will not try to look up into the cache to check if the `Articles` have
   * been loaded already.
   *
   * In case the `Articles` have been fetched successfully from the respective
   * endpoint in the API, the action `loadArticlesSuccess` containg the received
   * `Articles` will be dispatched. Otherwise if an error occured while loading,
   * the `loadArticlesFailure` action gets dispatched.
   */
  refreshArticles$ = createGenericEffect(
    this.actions$,
    ArticlesActions.refreshArticles,
    () => this.articlesService.getArticles(),
    () => ({
      success: articles => ArticlesActions.loadArticlesSuccess({ articles }),
      failure: () => ArticlesActions.loadArticlesFailure(),
    }),
  )();

  /**
   * This effect listens to the `deleteUserSuccess` action and will try to
   * refresh the Articles in order to get the updated `Articles`.
   */
  refreshArticlesAfterEvent$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.deleteUserSuccess, CategoryActions.deleteCategorySuccess),
      map(() => ArticlesActions.refreshArticles()),
    ),
  );

  constructor(
    private actions$: Actions,
    private store: Store<fromArticles.State>,
    private articlesService: ArticlesService,
  ) {}
}
