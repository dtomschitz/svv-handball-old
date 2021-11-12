import { createAction, props } from '@ngrx/store';
import { HvwCachingResult, HvwTable } from '@svv/core/models';

export const LOAD_TABLES = '[HVW] Load Tables';
export const LOAD_TABLES_SUCCESS = '[HVW] Load Tables Success';
export const LOAD_TABLES_FAILURE = '[HVW] Load Tables Failure';
export const LOAD_CACHED_TABLES = '[HVW] Load Cached Tables';

export const REFRESH_TABLES = '[HVW] Refresh Tables';

export const CACHE_TABLES = '[HVW] Cache Tables';
export const CACHE_TABLE_SUCCESS = '[HVW] Cache Tables Success';
export const CACHE_TABLES_FAILURE = '[HVW] Cache Tables Failure';

export const LOAD_TABLES_CACHING_RESULTS = '[HVW] Load Tables Caching Results';
export const LOAD_TABLES_CACHING_RESULTS_SUCCESS =
  '[HVW] Load Tables Caching Results Success';
export const LOAD_TABLES_CACHING_RESULTS_FAILURE =
  '[HVW] Load Tables Caching Results Failure';

export const DELETE_TABLES = '[HVW] Delete Tables';
export const DELETE_TABLES_SUCCESS = '[HVW] Delete Tables Success';
export const DELETE_TABLES_FAILURE = '[HVW] Delete Tables Failure';

export const loadTables = createAction(LOAD_TABLES);
export const loadTablesSuccess = createAction(
  LOAD_TABLES_SUCCESS,
  props<{ tables: HvwTable[] }>(),
);
export const loadTablesFailure = createAction(LOAD_TABLES_FAILURE);
export const loadCachedTables = createAction(LOAD_CACHED_TABLES);

export const refreshTables = createAction(REFRESH_TABLES);

export const cacheTables = createAction(CACHE_TABLES);
export const cacheTablesSuccess = createAction(
  CACHE_TABLE_SUCCESS,
  props<{ cachingResult: HvwCachingResult }>(),
);
export const cacheTablesFailure = createAction(CACHE_TABLES_FAILURE);

export const loadTablesCachingResults = createAction(
  LOAD_TABLES_CACHING_RESULTS,
);
export const loadTablesCachingResultsSuccess = createAction(
  LOAD_TABLES_CACHING_RESULTS_SUCCESS,
  props<{ cachingResults: HvwCachingResult[] }>(),
);
export const loadTablesCachingResultsFailure = createAction(
  LOAD_TABLES_CACHING_RESULTS_FAILURE,
);

export const deleteTables = createAction(DELETE_TABLES);
export const deleteTablesSuccess = createAction(DELETE_TABLES_SUCCESS);
export const deleteTablesFailure = createAction(DELETE_TABLES_FAILURE);
