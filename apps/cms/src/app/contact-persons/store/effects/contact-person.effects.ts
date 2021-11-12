import { Injectable } from '@angular/core';
import { Actions } from '@ngrx/effects';
import { createGenericEffect } from '@svv/cms/core/store/effects';
import { ContactPersonsService } from '@svv/cms/contact-persons/services';
import { ContactPersonActions } from '@svv/cms/contact-persons/store/actions';
import { HotToastService } from '@ngneat/hot-toast';

@Injectable()
export class ContactPersonEffects {
  /**
   * This effect listens to the `createContactPerson` action and will try to c
   * reate a new `Contact Person` based on the payload of the action.
   *
   * In case the `Contact Person` has been created successfully by the
   * respective endpoint in the API, the action `createContactPersonSuccess`
   * containg the newly created `Contact Person` will be dispatched. Otherwise
   * if an error occured while creating, the `createContactPersonFailure` action
   * gets dispatched.
   */
  createContactPerson$ = createGenericEffect(
    this.actions$,
    ContactPersonActions.createContactPerson,
    action =>
      this.contactPersonsService.createContactPerson(action.contactPerson),
    () => ({
      success: contactPerson =>
        ContactPersonActions.createContactPersonSuccess({ contactPerson }),
      failure: () => ContactPersonActions.createContactPersonFailure(),
    }),
  )(this.toastService);

  /**
   * This effect listens to the `updateContactPerson` action and will try to
   * update a existing `Contact Person` with the changes stored inside the
   * payload of the action.
   *
   * In case the `Contact Person` has been updated successfully by the
   * respective endpoint in the API, the action `updateContactPersonSuccess`
   * containg the update from the `updateContactPerson` action will be
   * dispatched. Otherwise if an error occured while updating, the
   * `updateContactPersonFailure` action gets dispatched.
   */
  updateContactPerson$ = createGenericEffect(
    this.actions$,
    ContactPersonActions.updateContactPerson,
    action => this.contactPersonsService.updateContactPerson(action.update),
    action => ({
      success: () =>
        ContactPersonActions.updateContactPersonSuccess({
          update: action.update,
        }),
      failure: () => ContactPersonActions.updateContactPersonFailure(),
    }),
  )(this.toastService);

  /**
   * This effect listens to the `deleteContactPerson` action and will try to
   * delete a existing `Contact Person` based on the id which stored in the
   * payload of the action.
   *
   * In case the `Contact Person` has been deleted successfully by the
   * respective endpoint in the API, the action `deleteContactPersonSuccess`
   * containg the id from the `deleteContactPerson` action will be dispatched.
   * Otherwise if an error occured while deleting, the
   * `deleteContactPersonFailure` action gets dispatched.
   */
  deleteContactPerson$ = createGenericEffect(
    this.actions$,
    ContactPersonActions.deleteContactPerson,
    action => this.contactPersonsService.deleteContactPerson(action.id),
    action => ({
      success: () =>
        ContactPersonActions.deleteContactPersonSuccess({ id: action.id }),
      failure: () => ContactPersonActions.deleteContactPersonFailure(),
    }),
  )(this.toastService);

  constructor(
    private actions$: Actions,
    private contactPersonsService: ContactPersonsService,
    private toastService: HotToastService,
  ) {}
}
