import { Injectable } from '@angular/core';
import { Actions } from '@ngrx/effects';
import { createGenericEffect } from '@svv/cms/core/store/effects';
import { ContactPersonCategoriesService } from '@svv/cms/contact-persons/services';
import { ContactPersonCategoryActions } from '@svv/cms/contact-persons/store/actions';
import { HotToastService } from '@ngneat/hot-toast';

@Injectable()
export class ContactPersonCategoryEffects {
  createContactPerson$ = createGenericEffect(
    this.actions$,
    ContactPersonCategoryActions.createContactPersonCategory,
    action =>
      this.contactPersonCategoriesService.createCategory(action.category),
    () => ({
      success: category =>
        ContactPersonCategoryActions.createContactPersonCategorySuccess({
          category,
        }),
      failure: () =>
        ContactPersonCategoryActions.createContactPersonCategoryFailure(),
    }),
  )(this.toastService);

  updateContactPerson$ = createGenericEffect(
    this.actions$,
    ContactPersonCategoryActions.updateContactPersonCategory,
    action => this.contactPersonCategoriesService.updateCategory(action.update),
    action => ({
      success: () =>
        ContactPersonCategoryActions.updateContactPersonCategorySuccess({
          update: action.update,
        }),
      failure: () =>
        ContactPersonCategoryActions.updateContactPersonCategoryFailure(),
    }),
  )(this.toastService);

  deleteContactPerson$ = createGenericEffect(
    this.actions$,
    ContactPersonCategoryActions.deleteContactPersonCategory,
    action => this.contactPersonCategoriesService.deleteCategory(action.id),
    action => ({
      success: () =>
        ContactPersonCategoryActions.deleteContactPersonCategorySuccess({
          id: action.id,
        }),
      failure: () =>
        ContactPersonCategoryActions.deleteContactPersonCategoryFailure(),
    }),
  )(this.toastService);

  constructor(
    private actions$: Actions,
    private contactPersonCategoriesService: ContactPersonCategoriesService,
    private toastService: HotToastService,
  ) {}
}
