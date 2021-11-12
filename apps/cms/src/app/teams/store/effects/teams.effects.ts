import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { map } from 'rxjs/operators';
import { HotToastService } from '@ngneat/hot-toast';
import { createGenericEffect } from '@svv/cms/core/store/effects';
import { UserActions } from '@svv/cms/users/store/actions';
import { TeamsService } from '@svv/cms/teams/services';
import { TeamsActions } from '@svv/cms/teams/store/actions';
import * as fromTeams from '@svv/cms/teams/store/reducers';

@Injectable()
export class TeamsEffects {
  /**
   * This effect listens to the `loadTeams` action and will try to fetch all
   * `Teams` from the API. In case the `Teams` have been already loaded and
   * stored in the state, the effect will use the cached `Teams` instead of
   * loading the data from the database each time.
   *
   * In case the `Teams` have been fetched successfully from the respective
   * endpoint in the API, the action `loadTeamsSuccess` containg the received
   * `Teams` will be dispatched. Otherwise if an error occured while loading,
   * the `loadTeamsFailure` action gets dispatched.
   */
  loadTeam$ = createGenericEffect(
    this.actions$,
    TeamsActions.loadTeams,
    () => this.teamsService.getTeams(),
    () => ({
      success: teams => TeamsActions.loadTeamsSuccess({ teams }),
      failure: () => TeamsActions.loadTeamsFailure(),
      cache: () => TeamsActions.loadTeamsCache(),
    }),
    {
      cachingSelector: this.store.select(fromTeams.selectIsLoaded),
    },
  )();

  /**
   * This effect listens to the `refreshTeams` action and will try to fetch all
   * `Teams` from the API. In contrast to the `loadTeams` effect, this one will
   * not try to look up into the cache to check if the `Teams` have been
   * loaded already.
   *
   * In case the `Teams` have been fetched successfully from the respective
   * endpoint in the API, the action `loadTeamsSuccess` containg the received
   * `Teams` will be dispatched. Otherwise if an error occured while loading,
   * the `loadTeamsFailure` action gets dispatched.
   */
  refreshTeam$ = createGenericEffect(
    this.actions$,
    TeamsActions.refreshTeams,
    () => this.teamsService.getTeams(),
    () => ({
      success: teams => TeamsActions.loadTeamsSuccess({ teams }),
      failure: () => TeamsActions.loadTeamsFailure(),
    }),
  )();

  /**
   * This effect listens to the `updateTeams` action and will try to update a
   * a list of existing `Teams` with the updates stored inside the payload of
   * the action.
   *
   * In case the `Teams` have been updated successfully by the respective
   * endpoint in the API, the action `updateTeamsSuccess` containg the updates
   * from the `updateTeams` action will be dispatched. Otherwise if an error
   * occured while updating, the `updateTeamsFailure` action gets dispatched.
   */
  updateTeams$ = createGenericEffect(
    this.actions$,
    TeamsActions.sortTeams,
    action => this.teamsService.updateTeams(action.updates),
    action => ({
      success: () => TeamsActions.sortTeamsSuccess({ updates: action.updates }),
      failure: () => TeamsActions.sortTeamsFailure(),
    }),
  )(this.toastService);

  /**
   * This effect listens to the `deleteUserSuccess` action and will try to
   * remove the id of the delete `User` from the coachIds array if the `User Role`
   * was set to `Coach`. The Effect will then dispatch the `updateTeams` actions
   * in order to trigger the update process of the `Teams`.
   */

  /**
   * This effect listens to the `deleteUserSuccess` action and will try to
   * refresh the `Teams` in order to get the updated `Teams`.
   */
  refreshTeamsAfterEvent$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.deleteUserSuccess),
      map(() => TeamsActions.refreshTeams()),
    ),
  );

  constructor(
    private actions$: Actions,
    private store: Store<fromTeams.State>,
    private teamsService: TeamsService,
    private toastService: HotToastService,
  ) {}
}
