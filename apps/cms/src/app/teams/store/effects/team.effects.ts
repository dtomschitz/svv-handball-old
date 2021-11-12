import { Injectable } from '@angular/core';
import { HotToastService } from '@ngneat/hot-toast';
import { Actions } from '@ngrx/effects';
import { createGenericEffect } from '@svv/cms/core/store/effects';
import { TeamsService } from '@svv/cms/teams/services';
import { TeamActions } from '@svv/cms/teams/store/actions';

@Injectable()
export class TeamEffects {
  /**
   * This effect listens to the `createTeam` action and will try to create a new
   * `Team` based on the payload of the action.
   *
   * In case the `Team` has been created successfully by the respective endpoint
   * in the API, the action `createTeamSuccess` containg the newly created `Team`
   * will be dispatched. Otherwise if an error occured while creating, the
   * `createTeamFailure` action gets dispatched.
   */
  createTeam$ = createGenericEffect(
    this.actions$,
    TeamActions.createTeam,
    action => this.teamsService.createTeam(action.team),
    () => ({
      success: team => TeamActions.createTeamSuccess({ team }),
      failure: () => TeamActions.createTeamFailure(),
    }),
  )(this.toastService);

  /**
   * This effect listens to the `updateTeam` action and will try to update a
   * existing `Team` with the changes stored inside the payload of the action.
   *
   * In case the `Team` has been updated successfully by the respective endpoint
   * in the API, the action `updateTeamSuccess` containg the update from the
   * `updateTeam` action will be dispatched. Otherwise if an error occured while
   * updating, the `updateTeamFailure` action gets dispatched.
   */
  updateTeam$ = createGenericEffect(
    this.actions$,
    TeamActions.updateTeam,
    ({ update }) => this.teamsService.updateTeam(update),
    ({ update }) => ({
      success: () => TeamActions.updateTeamSuccess({ update }),
      failure: () => TeamActions.updateTeamFailure(),
    }),
  )(this.toastService);

  /**
   * This effect listens to the `uploadTeamImage` action and will try to upload
   * the image from the payload of the action.
   *
   * In case the specific `Team` has been updated and the image has been stored
   * successfully on the backend by the respective endpoint in the API, the
   * action `uploadTeamImageSuccess` containg the received update will be
   * dispatched. Otherwise if an error occured, the `uploadTeamImageFailure`
   * action gets dispatched.
   */
  uploadTeamImage$ = createGenericEffect(
    this.actions$,
    TeamActions.uploadTeamImage,
    ({ id, image }) => this.teamsService.uploadTeamImage(id, image),
    () => ({
      success: update =>
        TeamActions.uploadTeamImageSuccess({
          update,
        }),
      failure: () => TeamActions.uploadTeamImageFailure(),
    }),
  )(this.toastService);

  /**
   * This effect listens to the `deleteTeamImage` action and will try to start
   * the deletion process of the generated `Team` images in the backend.
   *
   * In case the image of the specific `Team` has been deleted by the respective
   * endpoint in the API, the action `deleteTeamImageSuccess` containg the id
   * from the `deleteTeamImage` action will be dispatched. Otherwise if an error
   * occured, the `deleteTeamImageFailure` action gets dispatched.
   */
  deleteTeamImage$ = createGenericEffect(
    this.actions$,
    TeamActions.deleteTeamImage,
    ({ id }) => this.teamsService.deleteTeamImage(id),
    ({ id }) => ({
      success: () =>
        TeamActions.deleteTeamImageSuccess({
          update: {
            id,
            changes: {
              images: undefined,
            },
          },
        }),
      failure: () => TeamActions.deleteTeamImageFailure(),
    }),
  )(this.toastService);

  /**
   * This effect listens to the `deleteTeam` action and will try to delete a
   * existing `Team` based on the id which stored in the payload of the action.
   *
   * In case the `Team` has been deleted successfully by the respective endpoint
   * in the API, the action `deleteTeamSuccess` containg the id from the
   * `deleteTeam` action will be dispatched. Otherwise if an error occured while
   * deleting, the `deleteTeamFailure` action gets dispatched.
   */
  deleteTeam$ = createGenericEffect(
    this.actions$,
    TeamActions.deleteTeam,
    ({ id }) => this.teamsService.deleteTeam(id),
    ({ id }) => ({
      success: () => TeamActions.deleteTeamSuccess({ id }),
      failure: () => TeamActions.deleteTeamFailure(),
    }),
  )(this.toastService);

  constructor(
    private actions$: Actions,
    private teamsService: TeamsService,
    private toastService: HotToastService,
  ) {}
}
