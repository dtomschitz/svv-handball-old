import { Injectable } from '@angular/core';
import { HotToastService } from '@ngneat/hot-toast';
import { Actions } from '@ngrx/effects';
import { createGenericEffect } from '@svv/cms/core/store/effects';
import { ArticlesService } from '@svv/cms/articles//services';
import { ArticleActions } from '@svv/cms/articles/store/actions';

@Injectable()
export class ArticleEffects {
  /**
   * This effect listens to the `createArticle` action and will try to create a
   * new `Article` based on the payload of the action.
   *
   * In case the `Article` has been created successfully by the respective
   * endpoint in the API, the action `createArticleSuccess` containg the newly
   * created `Article` will be dispatched. Otherwise if an error occured while
   * creating, the `createArticleFailure` action gets dispatched.
   */
  createArticle$ = createGenericEffect(
    this.actions$,
    ArticleActions.createArticle,
    action => this.articlesService.createArticle(action.article),
    () => ({
      success: article => ArticleActions.createArticleSuccess({ article }),
      failure: () => ArticleActions.createArticleFailure(),
    }),
  )(this.toastService);

  /**
   * This effect listens to the `updateArticle` action and will try to update a
   * existing `Article` with the changes stored inside the payload of the action.
   *
   * In case the `Article` has been updated successfully by the respective
   * endpoint in the API, the action `updateArticleSuccess` containg the update
   * from the `updateArticle` action will be dispatched. Otherwise if an error
   * occured while updating, the `updateArticleFailure` action gets dispatched.
   */
  updateArticle$ = createGenericEffect(
    this.actions$,
    ArticleActions.updateArticle,
    ({ update }) => this.articlesService.updateArticle(update),
    ({ update }) => ({
      success: () => ArticleActions.updateArticleSuccess({ update }),
      failure: () => ArticleActions.updateArticleFailure(),
    }),
  )(this.toastService);

  /**
   * This effect listens to the `deleteArticle` action and will try to delete a
   * existing `Article` based on the id which stored in the payload of the action.
   *
   * In case the `Article` has been deleted successfully by the respective
   * endpoint in the API, the action `deleteArticleSuccess` containg the id from
   * the `deleteArticle` action will be dispatched. Otherwise if an error
   * occured while deleting, the `deleteArticleFailure` action gets dispatched.
   */
  deleteArticle$ = createGenericEffect(
    this.actions$,
    ArticleActions.deleteArticle,
    ({ id }) => this.articlesService.deleteArticle(id),
    ({ id }) => ({
      success: () => ArticleActions.deleteArticleSuccess({ id }),
      failure: () => ArticleActions.deleteArticleFailure(),
    }),
  )(this.toastService);

  constructor(
    private actions$: Actions,
    private articlesService: ArticlesService,
    private toastService: HotToastService,
  ) {}
}
