import { createAction, props } from '@ngrx/store';
import { HvwJob } from '@svv/core/models';

export const LOAD_JOBS = '[HVW] Load Jobs';
export const LOAD_JOBS_SUCCESS = '[HVW] Load Jobs Success';
export const LOAD_JOBS_FAILURE = '[HVW] Load Jobs Failure';
export const LOAD_CACHED_JOBS = '[HVW] Load Cached Jobs';

export const REFRESH_JOBS = '[HVW] Refresh Jobs';

export const loadJobs = createAction(LOAD_JOBS);
export const loadJobsSuccess = createAction(
  LOAD_JOBS_SUCCESS,
  props<{ jobs: HvwJob[] }>(),
);
export const loadJobsFailure = createAction(LOAD_JOBS_FAILURE);
export const loadCachedJobs = createAction(LOAD_CACHED_JOBS);

export const refreshJobs = createAction(REFRESH_JOBS);
