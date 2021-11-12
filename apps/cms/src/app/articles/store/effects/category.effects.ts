import { Injectable } from '@angular/core';
import { Actions } from '@ngrx/effects';
import { HotToastService } from '@ngneat/hot-toast';
import { CategoriesService } from '@svv/cms/articles/services';
import { CategoryActions } from '@svv/cms/articles/store/actions';
import { createGenericEffect } from '@svv/cms/core/store/effects';

@Injectable()
export class CategoryEffects {
  /**
   * This effect listens to the `createCategory` action and will try to create a
   * new `Category` based on the payload of the action.
   *
   * In case the `Category` has been created successfully by the respective
   * endpoint in the API, the action `createCategorySuccess` containg the newly
   * created `Category` will be dispatched. Otherwise if an error occured while
   * creating, the `createCategoryFailure` action gets dispatched.
   */
  createCategory$ = createGenericEffect(
    this.actions$,
    CategoryActions.createCategory,
    action => this.articlesService.createCategory(action.category),
    () => ({
      success: category => CategoryActions.createCategorySuccess({ category }),
      failure: () => CategoryActions.createCategoryFailure(),
    }),
  )(this.toastService);

  /**
   * This effect listens to the `updateCategory` action and will try to update a
   * existing `Category` with the changes stored inside the payload of the action.
   *
   * In case the `Category` has been updated successfully by the respective
   * endpoint in the API, the action `updateCategorySuccess` containg the update
   * from the `updateCategory` action will be dispatched. Otherwise if an error
   * occured while updating, the `updateCategoryFailure` action gets dispatched.
   */
  updateCategory$ = createGenericEffect(
    this.actions$,
    CategoryActions.updateCategory,
    ({ update }) => this.articlesService.updateCategory(update),
    ({ update }) => ({
      success: () => CategoryActions.updateCategorySuccess({ update }),
      failure: () => CategoryActions.updateCategoryFailure(),
    }),
  )(this.toastService);

  /**
   * This effect listens to the `deleteCategory` action and will try to delete a
   * existing `Category` based on the id which stored in the payload of the action.
   *
   * In case the `Category` has been deleted successfully by the respective
   * endpoint in the API, the action `deleteCategorySuccess` containg the id from
   * the `deleteCategory` action will be dispatched. Otherwise if an error
   * occured while deleting, the `deleteCategoryFailure` action gets dispatched.
   */
  deleteCategory$ = createGenericEffect(
    this.actions$,
    CategoryActions.deleteCategory,
    ({ id }) => this.articlesService.deleteCategory(id),
    ({ id }) => ({
      success: () => CategoryActions.deleteCategorySuccess({ id }),
      failure: () => CategoryActions.deleteCategoryFailure(),
    }),
  )(this.toastService);

  constructor(
    private actions$: Actions,
    private articlesService: CategoriesService,
    private toastService: HotToastService,
  ) {}
}
