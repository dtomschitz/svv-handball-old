import { createAction, props } from '@ngrx/store';
import { HvwCachingResult, HvwGame } from '@svv/core/models';

export const LOAD_GAMES = '[HVW] Load Games';
export const LOAD_GAMES_SUCCES = '[HVW] Load Games Success';
export const LOAD_GAMES_FAILURE = '[HVW] Load Games Failure';
export const LOAD_CACHED_GAMES = '[HVW] Load Cached Games';

export const REFRESH_GAMES = '[HVW] Refresh Games';

export const CACHE_GAMES = '[HVW] Cache Games';
export const CACHE_GAMES_SUCCESS = '[HVW] Cache Games Success';
export const CACHE_GAMES_FAILURE = '[HVW] Cache Games Failure';

export const LOAD_GAMES_CACHING_RESULTS = '[HVW] Load Games Caching Results';
export const LOAD_GAMES_CACHING_RESULTS_SUCCESS =
  '[HVW] Load Games Caching Results Success';
export const LOAD_GAMES_CACHING_RESULTS_FAILURE =
  '[HVW] Load Games Caching Results Failure';

export const DELETE_GAMES = '[HVW] Delete Games';
export const DELETE_GAMES_SUCCESS = '[HVW] Delete Games Success';
export const DELETE_GAMES_FAILURE = '[HVW] Delete Games Failure';

export const loadGames = createAction(LOAD_GAMES);
export const loadGamesSuccess = createAction(
  LOAD_GAMES_SUCCES,
  props<{ games: HvwGame[] }>(),
);
export const loadGamesFailure = createAction(LOAD_GAMES_FAILURE);
export const loadCachedGames = createAction(LOAD_CACHED_GAMES);

export const refreshGames = createAction(REFRESH_GAMES);

export const cacheGames = createAction(CACHE_GAMES);
export const cacheGamesSuccess = createAction(
  CACHE_GAMES_SUCCESS,
  props<{ cachingResult: HvwCachingResult }>(),
);
export const cacheGamesFailure = createAction(CACHE_GAMES_FAILURE);

export const loadGamesCachingResults = createAction(LOAD_GAMES_CACHING_RESULTS);
export const loadGamesCachingResultsSuccess = createAction(
  LOAD_GAMES_CACHING_RESULTS_SUCCESS,
  props<{ cachingResults: HvwCachingResult[] }>(),
);
export const loadGamesCachingResultsFailure = createAction(
  LOAD_GAMES_CACHING_RESULTS_FAILURE,
);

export const deleteGames = createAction(DELETE_GAMES);
export const deleteGamesSuccess = createAction(DELETE_GAMES_SUCCESS);
export const deleteGamesFailure = createAction(DELETE_GAMES_FAILURE);
