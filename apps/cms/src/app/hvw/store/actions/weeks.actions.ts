import { createAction, props } from '@ngrx/store';
import { HvwCachingResult, HvwWeek } from '@svv/core/models';

export const LOAD_WEEKS = '[HVW] Load Weeks';
export const LOAD_WEEKS_SUCCESS = '[HVW] Load Weeks Success';
export const LOAD_WEEKS_FAILURE = '[HVW] Load Weeks Failure';
export const LOAD_CACHED_WEEKS = '[HVW] Load Cached Weeks';

export const REFRESH_WEEKS = '[HVW] Refresh Weeks';

export const CACHE_WEEKS = '[HVW] Cache Weeks';
export const CACHE_WEEKS_SUCCESS = '[HVW] Cache Weeks Success';
export const CACHE_WEEKS_FAILURE = '[HVW] Cache Weeks Failure';

export const LOAD_WEEKS_CACHING_RESULTS = '[HVW] Load Weeks Caching Results';
export const LOAD_WEEKS_CACHING_RESULTS_SUCCESS =
  '[HVW] Load Weeks Caching Results Success';
export const LOAD_WEEKS_CACHING_RESULTS_FAILURE =
  '[HVW] Load Weeks Caching Results Failure';

export const DELETE_WEEKS = '[HVW] Delete Weeks';
export const DELETE_WEEKS_SUCCESS = '[HVW] Delete Weeks Success';
export const DELETE_WEEKS_FAILURE = '[HVW] Delete Weeks Failure';

export const loadWeeks = createAction(LOAD_WEEKS);
export const loadWeeksSuccess = createAction(
  LOAD_WEEKS_SUCCESS,
  props<{ weeks: HvwWeek[] }>(),
);
export const loadWeeksFailure = createAction(LOAD_WEEKS_FAILURE);
export const loadCachedWeeks = createAction(LOAD_CACHED_WEEKS);

export const refreshWeeks = createAction(REFRESH_WEEKS);

export const cacheWeeks = createAction(CACHE_WEEKS);
export const cacheWeeksSuccess = createAction(
  CACHE_WEEKS_SUCCESS,
  props<{ cachingResult: HvwCachingResult }>(),
);
export const cacheWeeksFailure = createAction(CACHE_WEEKS_FAILURE);

export const loadWeeksCachingResults = createAction(LOAD_WEEKS_CACHING_RESULTS);
export const loadWeeksCachingResultsSuccess = createAction(
  LOAD_WEEKS_CACHING_RESULTS_SUCCESS,
  props<{ cachingResults: HvwCachingResult[] }>(),
);
export const loadWeeksCachingResultsFailure = createAction(
  LOAD_WEEKS_CACHING_RESULTS_FAILURE,
);

export const deleteWeeks = createAction(DELETE_WEEKS);
export const deleteWeeksSuccess = createAction(DELETE_WEEKS_SUCCESS);
export const deleteWeeksFailure = createAction(DELETE_WEEKS_FAILURE);
