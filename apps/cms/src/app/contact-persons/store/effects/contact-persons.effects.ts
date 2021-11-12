import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Actions } from '@ngrx/effects';
import { HotToastService } from '@ngneat/hot-toast';
import { createGenericEffect } from '@svv/cms/core/store/effects';
import { ContactPersonsService } from '@svv/cms/contact-persons/services';
import { ContactPersonsActions } from '@svv/cms/contact-persons/store/actions';
import * as fromContactPersons from '@svv/cms/contact-persons/store/reducers';

@Injectable()
export class ContactPersonsEffects {
  /**
   * This effect listens to the `loadContactPersons` action and will try to fetch
   * all `Contact Persons` from the API. In case the `Contact Persons` have been
   *  already loaded and stored in the state, the effect will use the cached
   * `Contact Persons` instead of loading the data from the database each time.
   *
   * In case the `Contact Persons` have been fetched successfully from the
   * respective endpoint in the API, the action `loadContactPersonsSuccess`
   * containg the received `Contact Persons` will be dispatched. Otherwise if an
   * error occured while loading, the `loadContactPersonsFailure` action
   * gets dispatched.
   */
  loadContactPersons$ = createGenericEffect(
    this.actions$,
    ContactPersonsActions.loadContactPersons,
    () => this.contactPersonsService.getContactPersons(),
    () => ({
      success: contactPersons =>
        ContactPersonsActions.loadContactPersonsSuccess({ contactPersons }),
      failure: () => ContactPersonsActions.loadContactPersonsFailure(),
      cache: () => ContactPersonsActions.loadContactPersonsCache(),
    }),
    {
      cachingSelector: this.store.select(
        fromContactPersons.selectIsContactPersonsLoaded,
      ),
    },
  )();

  /**
   * This effect listens to the `refreshContactPersons` action and will try to
   * fetch all `Contact Persons` from the API. In contrast to the
   * `refreshContactPersons` effect, this one will not try to look up into the
   * cache to check if the `Contact Persons` have been loaded already.
   *
   * In case the `Contact Persons` have been fetched successfully from the
   * respective endpoint in the API, the action `loadContactPersonsSuccess`
   * containg the received `Contact Persons` will be dispatched. Otherwise if an
   * error occured while loading, the `loadContactPersonsFailure` action
   * gets dispatched.
   */
  refreshContactPersons$ = createGenericEffect(
    this.actions$,
    ContactPersonsActions.refreshContactPersons,
    () => this.contactPersonsService.getContactPersons(),
    () => ({
      success: contactPersons =>
        ContactPersonsActions.loadContactPersonsSuccess({ contactPersons }),
      failure: () => ContactPersonsActions.loadContactPersonsFailure(),
    }),
  )();

  /**
   * This effect listens to the `updateContactPersons` action and will try to
   * update a list of existing `Contact Persons` with the updates stored inside
   * the payload of the action.
   *
   * In case the `Contact Persons` have been updated successfully by the
   * respective endpoint in the API, the action `updateContactPersonsSuccess`
   * containg the updates from the `updateContactPersons` action will be
   * dispatched. Otherwise if an error occured while updating, the
   * `updateContactPersonsFailure` action gets dispatched.
   */
  updateContactPersons$ = createGenericEffect(
    this.actions$,
    ContactPersonsActions.sortContactPersons,
    action => this.contactPersonsService.updateContactPersons(action.updates),
    action => ({
      success: () =>
        ContactPersonsActions.sortContactPersonsSuccess({
          updates: action.updates,
        }),
      failure: () => ContactPersonsActions.sortContactPersonsFailure(),
    }),
  )(this.toastService);

  constructor(
    private actions$: Actions,
    private store: Store<fromContactPersons.State>,
    private contactPersonsService: ContactPersonsService,
    private toastService: HotToastService,
  ) {}
}
