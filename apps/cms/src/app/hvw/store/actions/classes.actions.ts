import { createAction, props } from '@ngrx/store';
import { HvwCachingResult, HvwClass } from '@svv/core/models';

export const LOAD_CLASSES = '[HVW] Load Class';
export const LOAD_CLASSES_SUCCESS = '[HVW] Load Classes Success';
export const LOAD_CLASSES_FAILURE = '[HVW] Load Classes Failure';
export const LOAD_CACHED_CLASSES = '[HVW] Load Cached Classes';

export const REFRESH_CLASSES = '[HVW] Refresh Classes';

export const CACHE_CLASSES = '[HVW] Cache Classes';
export const CACHE_CLASSES_SUCCESS = '[HVW] Cache Classes Success';
export const CACHE_CLASSES_FAILURE = '[HVW] Cache Classes Failure';

export const LOAD_CLASSES_CACHING_RESULTS =
  '[HVW] Load Classes Caching Results';
export const LOAD_CLASSES_CACHING_RESULTS_SUCCESS =
  '[HVW] Load Classes Caching Results Success';
export const LOAD_CLASSES_CACHING_RESULTS_FAILURE =
  '[HVW] Load Classes Caching Results Failure';

export const DELETE_CLASSES = '[HVW] Delete Class';
export const DELETE_CLASSES_SUCCESS = '[HVW] Delete Classes Success';
export const DELETE_CLASSES_FAILURE = '[HVW] Delete Classes Failure';

export const loadClasses = createAction(LOAD_CLASSES);
export const loadClassesSuccess = createAction(
  LOAD_CLASSES_SUCCESS,
  props<{ classes: HvwClass[] }>(),
);
export const loadClassesFailure = createAction(LOAD_CLASSES_FAILURE);
export const loadCachedClasses = createAction(LOAD_CACHED_CLASSES);

export const refreshClasses = createAction(REFRESH_CLASSES);

export const cacheClasses = createAction(CACHE_CLASSES);
export const cacheClassesSuccess = createAction(
  CACHE_CLASSES_SUCCESS,
  props<{ cachingResult: HvwCachingResult }>(),
);
export const cacheClassesFailure = createAction(CACHE_CLASSES_FAILURE);

export const loadClassesCachingResults = createAction(
  LOAD_CLASSES_CACHING_RESULTS,
);
export const loadClassesCachingResultsSuccess = createAction(
  LOAD_CLASSES_CACHING_RESULTS_SUCCESS,
  props<{ cachingResults: HvwCachingResult[] }>(),
);
export const loadClassesCachingResultsFailure = createAction(
  LOAD_CLASSES_CACHING_RESULTS_FAILURE,
);

export const deleteClasses = createAction(DELETE_CLASSES);
export const deleteClassesSuccess = createAction(DELETE_CLASSES_SUCCESS);
export const deleteClassesFailure = createAction(DELETE_CLASSES_FAILURE);
