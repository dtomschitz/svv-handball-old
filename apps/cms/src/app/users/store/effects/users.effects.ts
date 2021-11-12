import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Actions } from '@ngrx/effects';
import { createGenericEffect } from '@svv/cms/core/store/effects';
import { UsersService } from '@svv/cms/users/services';
import { UsersActions } from '@svv/cms/users/store/actions';
import * as fromUsers from '@svv/cms/users/store/reducers';

@Injectable()
export class UsersEffects {
  /**
   * This effect listens to the `loadUsers` action and will try to fetch all
   * `Users` from the API. In case the `Users` have been already loaded and
   * stored in the state, the effect will use the cached `Users` instead of
   * loading the data from the database each time.
   *
   * In case the `Users` have been fetched successfully from the respective
   * endpoint in the API, the action `loadUsersSuccess` containg the received
   * `Users` will be dispatched. Otherwise if an error occured while loading,
   * the `loadUsersFailure` action gets dispatched.
   */
  loadUsers$ = createGenericEffect(
    this.actions$,
    UsersActions.loadUsers,
    () => this.usersService.getUsers(),
    () => ({
      success: users => UsersActions.loadUsersSuccess({ users }),
      failure: () => UsersActions.loadUsersFailure(),
      cache: () => UsersActions.loadUsersCache(),
    }),
    {
      cachingSelector: this.store.select(fromUsers.selectIsLoaded),
    },
  )();

  /**
   * This effect listens to the `refreshUsers` action and will try to fetch all
   * `Users` from the API. In contrast to the `loadUsers` effect, this one will
   * not try to look up into the cache to check if the `Users` have been
   * loaded already.
   *
   * In case the `Users` have been fetched successfully from the respective
   * endpoint in the API, the action `loadUsersSuccess` containg the received
   * `Users` will be dispatched. Otherwise if an error occured while loading,
   * the `loadUsersFailure` action gets dispatched.
   */
  refreshUsers$ = createGenericEffect(
    this.actions$,
    UsersActions.refreshUsers,
    () => this.usersService.getUsers(),
    () => ({
      success: users => UsersActions.refreshUsersSuccess({ users }),
      failure: () => UsersActions.refreshUsersFailure(),
    }),
  )();

  constructor(
    private actions$: Actions,
    private store: Store<fromUsers.State>,
    private usersService: UsersService,
  ) {}
}
