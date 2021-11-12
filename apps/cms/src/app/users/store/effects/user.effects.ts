import { Injectable } from '@angular/core';
import { HotToastService } from '@ngneat/hot-toast';
import { Actions } from '@ngrx/effects';
import { createGenericEffect } from '@svv/cms/core/store/effects';
import { UsersService } from '@svv/cms/users/services';
import { UserActions } from '@svv/cms/users/store/actions';

@Injectable()
export class UserEffects {
  /**
   * This effect listens to the `createUser` action and will try to create a new
   * `User` based on the payload of the action.
   *
   * In case the `User` has been created successfully by the respective endpoint
   * in the API, the action `createUserSuccess` containg the newly created `User`
   * will be dispatched. Otherwise if an error occured while creating, the
   * `createUserFailure` action gets dispatched.
   */
  createUser$ = createGenericEffect(
    this.actions$,
    UserActions.createUser,
    action => this.usersService.createUser(action.user),
    () => ({
      success: user => UserActions.createUserSuccess({ user }),
      failure: () => UserActions.createUserFailure(),
    }),
  )(this.toastService);

  /**
   * This effect listens to the `updateUser` action and will try to update a
   * existing `User` with the changes stored inside the payload of the action.
   *
   * In case the `User` has been updated successfully by the respective endpoint
   * in the API, the action `updateUserSuccess` containg the update from the
   * `updateUser` action will be dispatched. Otherwise if an error occured while
   * updating, the `updateUserFailure` action gets dispatched.
   */
  updateUser$ = createGenericEffect(
    this.actions$,
    UserActions.updateUser,
    action => this.usersService.updateUser(action.update),
    action => ({
      success: () => UserActions.updateUserSuccess({ update: action.update }),
      failure: () => UserActions.updateUserFailure(),
    }),
  )(this.toastService);

  /**
   * This effect listens to the `deleteUser` action and will try to delete a
   * existing `User` based on the id which stored in the payload of the action.
   *
   * In case the `User` has been deleted successfully by the respective endpoint
   * in the API, the action `deleteUserSuccess` containg the id from the
   * `deleteUser` action will be dispatched. Otherwise if an error occured while
   * deleting, the `deleteUserFailure` action gets dispatched.
   */
  deleteUser$ = createGenericEffect(
    this.actions$,
    UserActions.deleteUser,
    action => this.usersService.deleteUser(action.id),
    action => ({
      success: () => UserActions.deleteUserSuccess({ id: action.id }),
      failure: () => UserActions.deleteUserFailure(),
    }),
  )(this.toastService);

  constructor(
    private actions$: Actions,
    private usersService: UsersService,
    private toastService: HotToastService,
  ) {}
}
