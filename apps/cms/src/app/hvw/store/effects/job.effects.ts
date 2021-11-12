import { Injectable } from '@angular/core';
import { Actions } from '@ngrx/effects';
import { HotToastService } from '@ngneat/hot-toast';
import { createGenericEffect } from '@svv/cms/core/store/effects';
import { JobActions } from '@svv/cms/hvw/store/actions';
import { HvwJobsService } from '@svv/cms/hvw/services';

@Injectable()
export class JobEffects {
  /**
   * This effect listens to the `createJob` action and will try to create a new
   * `HvwJob` based on the payload of the action.
   *
   * In case the `HvwJob` has been created successfully by the respective
   * endpoint in the API, the action `createJobSuccess` containg the newly
   * created `HvwJob` will be dispatched. Otherwise if an error occured while
   * creating, the `createJobFailure` action gets dispatched.
   */
  createJob$ = createGenericEffect(
    this.actions$,
    JobActions.createJob,
    action => this.jobService.createJob(action.job),
    () => ({
      success: job => JobActions.createJobSuccess({ job }),
      failure: () => JobActions.createJobFailure(),
    }),
  )(this.toastService);

  /**
   * This effect listens to the `updateJob` action and will try to update a
   * existing `HvwJob` with the changes stored inside the payload of the action.
   *
   * In case the `HvwJob` has been updated successfully by the respective endpoint
   * in the API, the action `updateJobSuccess` containg the update from the
   * `updateJob` action will be dispatched. Otherwise if an error occured while
   * updating, the `updateJobFailure` action gets dispatched.
   */
  updateJob$ = createGenericEffect(
    this.actions$,
    JobActions.updateJob,
    action => this.jobService.updateJob(action.update),
    action => ({
      success: () => JobActions.updateJobSuccess({ update: action.update }),
      failure: () => JobActions.updateJobFailure(),
    }),
  )(this.toastService);

  /**
   * This effect listens to the `deleteJob` action and will try to delete a
   * existing `HvwJob` based on the id which stored in the payload of the action.
   *
   * In case the `HvwJob` has been deleted successfully by the respective endpoint
   * in the API, the action `deleteJobSuccess` containg the id from the
   * `deleteJob` action will be dispatched. Otherwise if an error occured while
   * deleting, the `deleteJobFailure` action gets dispatched.
   */
  deleteJob$ = createGenericEffect(
    this.actions$,
    JobActions.deleteJob,
    action => this.jobService.deleteJob(action.id),
    action => ({
      success: () => JobActions.deleteJobSuccess({ id: action.id }),
      failure: () => JobActions.deleteJobFailure(),
    }),
  )(this.toastService);

  constructor(
    private actions$: Actions,
    private jobService: HvwJobsService,
    private toastService: HotToastService,
  ) {}
}
