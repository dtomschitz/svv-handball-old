import { Actions } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { JobsActions } from '@svv/cms/hvw/store/actions';
import { HvwJobsService } from '@svv/cms/hvw/services';
import { createGenericEffect } from '@svv/cms/core/store/effects';
import * as fromHvw from '@svv/cms/hvw/store/reducers';

const defaultDelay = 500;

@Injectable()
export class JobsEffects {
  /**
   * This effect listens to the `loadJobs` action and will try to fetch all
   * `HvwJobs` from the API. In case the `HvwJobs` have been already loaded and
   * stored in the state, the effect will use the cached `HvwJobs` instead of
   * loading the data from the database each time.
   *
   * In case the `HvwJobs` have been fetched successfully from the respective
   * endpoint in the API, the action `loadJobsSuccess` containg the received
   * `HvwJobs` will be dispatched. Otherwise if an error occured while loading,
   * the `loadJobsFailure` action gets dispatched.
   */
  loadJobs$ = createGenericEffect(
    this.actions$,
    JobsActions.loadJobs,
    () => this.jobsService.getJobs(),
    () => ({
      success: jobs => JobsActions.loadJobsSuccess({ jobs }),
      failure: () => JobsActions.loadJobsFailure(),
      cache: () => JobsActions.loadCachedJobs(),
    }),
    {
      cachingSelector: this.store.pipe(select(fromHvw.selectIsJobsLoaded)),
    },
  )();

  /**
   * This effect listens to the `refreshJobs` action and will try to fetch all
   * `HvwJobs` from the API. In contrast to the `loadJobs` effect, this one will
   * not try to look up into the cache to check if the `HvwJobs` have been
   * loaded already.
   *
   * In case the `HvwJobs` have been fetched successfully from the respective
   * endpoint in the API, the action `loadJobsSuccess` containg the received
   * `HvwJobs` will be dispatched. Otherwise if an error occured while loading,
   * the `loadJobsFailure` action gets dispatched.
   */
  refreshJobs$ = createGenericEffect(
    this.actions$,
    JobsActions.refreshJobs,
    () => this.jobsService.getJobs(),
    () => ({
      success: jobs => JobsActions.loadJobsSuccess({ jobs }),
      failure: () => JobsActions.loadJobsFailure(),
    }),
  )();

  constructor(
    private actions$: Actions,
    private store: Store<fromHvw.State>,
    private jobsService: HvwJobsService,
  ) {}
}
