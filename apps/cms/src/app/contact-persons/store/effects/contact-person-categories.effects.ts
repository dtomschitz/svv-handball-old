import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Actions } from '@ngrx/effects';
import { HotToastService } from '@ngneat/hot-toast';
import { createGenericEffect } from '@svv/cms/core/store/effects';
import { ContactPersonCategoriesService } from '@svv/cms/contact-persons/services';
import { ContactPersonCategoriesActions } from '@svv/cms/contact-persons/store/actions';
import * as fromContactPersonCategories from '@svv/cms/contact-persons/store/reducers';

@Injectable()
export class ContactPersonCategoriesEffects {
  /**
   * This effect listens to the `loadContactPersonCategories` action and will
   * try to fetch all `Contact Persons` from the API. In case the
   * `Contact Persons` have been already loaded and stored in the state, the
   * effect will use the cached`Contact Persons` instead of loading the data
   * from the database each time.
   *
   * In case the `Contact Persons` have been fetched successfully from the
   * respective endpoint in the API, the action `loadContactPersonCategoriesSuccess`
   * containg the received `Contact Persons` will be dispatched. Otherwise if an
   * error occured while loading, the `loadContactPersonCategoriesFailure` action
   * gets dispatched.
   */
  loadCategories$ = createGenericEffect(
    this.actions$,
    ContactPersonCategoriesActions.loadContactPersonCategories,
    () => this.categoriesService.getCategories(),
    () => ({
      success: categories =>
        ContactPersonCategoriesActions.loadContactPersonCategoriesSuccess({
          categories,
        }),
      failure: () =>
        ContactPersonCategoriesActions.loadContactPersonCategoriesFailure(),
      cache: () =>
        ContactPersonCategoriesActions.loadContactPersonCategoriesCache(),
    }),
    {
      cachingSelector: this.store.select(
        fromContactPersonCategories.selectIsContactPersonCategoriesLoaded,
      ),
    },
  )();

  /**
   * This effect listens to the `refreshContactPersonCategories` action and
   * will try to fetch all `Contact Persons` from the API. In contrast to the
   * `refreshContactPersonCategories` effect, this one will not try to look up
   * into the cache to check if the `Contact Persons` have been loaded already.
   *
   * In case the `Contact Persons` have been fetched successfully from the
   * respective endpoint in the API, the action `loadContactPersonCategoriesSuccess`
   * containg the received `Contact Persons` will be dispatched. Otherwise if an
   * error occured while loading, the `loadContactPersonCategoriesFailure` action
   * gets dispatched.
   */
  refreshCategories$ = createGenericEffect(
    this.actions$,
    ContactPersonCategoriesActions.refreshContactPersonCategories,
    () => this.categoriesService.getCategories(),
    () => ({
      success: categories =>
        ContactPersonCategoriesActions.loadContactPersonCategoriesSuccess({
          categories,
        }),
      failure: () =>
        ContactPersonCategoriesActions.loadContactPersonCategoriesFailure(),
    }),
  )();

  /**
   * This effect listens to the `updateContactPersonCategories` action and will
   * try to update a list of existing `Contact Persons` with the updates stored
   * inside the payload of the action.
   *
   * In case the `Contact Persons` have been updated successfully by the
   * respective endpoint in the API, the action `updateContactPersonCategoriesSuccess`
   * containg the updates from the `updateContactPersonCategories` action will be
   * dispatched. Otherwise if an error occured while updating, the
   * `updateContactPersonCategoriesFailure` action gets dispatched.
   */
  sortCategories$ = createGenericEffect(
    this.actions$,
    ContactPersonCategoriesActions.sortContactPersonCategories,
    action => this.categoriesService.updateCategories(action.updates),
    action => ({
      success: () =>
        ContactPersonCategoriesActions.sortContactPersonCategoriesSuccess({
          updates: action.updates,
        }),
      failure: () =>
        ContactPersonCategoriesActions.sortContactPersonCategoriesFailure(),
    }),
  )(this.toastService);

  constructor(
    private actions$: Actions,
    private store: Store<fromContactPersonCategories.State>,
    private categoriesService: ContactPersonCategoriesService,
    private toastService: HotToastService,
  ) {}
}
