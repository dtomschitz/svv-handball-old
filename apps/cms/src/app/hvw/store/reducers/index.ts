import {
  Action,
  combineReducers,
  createFeatureSelector,
  createSelector,
} from '@ngrx/store';
import * as fromRoot from '@svv/cms/reducers';
import * as fromGames from './games.reducer';
import * as fromClasses from './classes.reducer';
import * as fromWeeks from './weeks.reducer';
import * as fromTables from './tables.reducer';
import * as fromJobs from './jobs.reducer';
import { Dictionary } from '@ngrx/entity';
import { HvwClass } from '@svv/core/models';

/**
 * The global feature key of the `HVW` state.
 */
export const featureKey = 'hvw';

/**
 * Interface used to describe the `HVW` state.
 */
export interface HvwState {
  [fromGames.featureKey]: fromGames.State;
  [fromClasses.featureKey]: fromClasses.State;
  [fromWeeks.featureKey]: fromWeeks.State;
  [fromTables.featureKey]: fromTables.State;
  [fromJobs.featureKey]: fromJobs.State;
}

export interface State extends fromRoot.State {
  [featureKey]: HvwState;
}

/**
 * Creates an combined reducer function for managing the `HVW` feature slice
 * of the root state.
 */
export function reducers(state: HvwState | undefined, action: Action) {
  return combineReducers<HvwState, Action>({
    [fromGames.featureKey]: fromGames.reducer,
    [fromClasses.featureKey]: fromClasses.reducer,
    [fromWeeks.featureKey]: fromWeeks.reducer,
    [fromTables.featureKey]: fromTables.reducer,
    [fromJobs.featureKey]: fromJobs.reducer,
  })(state, action);
}

/**
 * Selects the `HVW` state.
 */
export const selectHvwState = createFeatureSelector<State, HvwState>(
  featureKey,
);

/**
 * Selects the `Games` state.
 */
export const selectGamesState = createSelector(
  selectHvwState,
  state => state[fromGames.featureKey],
);

/**
 * Selects the `Classes` state.
 */
export const selectClassesState = createSelector(
  selectHvwState,
  state => state[fromClasses.featureKey],
);

/**
 * Selects the `Weeks` state.
 */
export const selectWeeksState = createSelector(
  selectHvwState,
  state => state[fromWeeks.featureKey],
);

/**
 * Selects the `Tables` state.
 */
export const selectTablesState = createSelector(
  selectHvwState,
  state => state[fromTables.featureKey],
);

/**
 * Selects the `HvwJobs` state.
 */
export const selectJobsState = createSelector(
  selectHvwState,
  state => state[fromJobs.featureKey],
);

/**
 * Transforms and sorts the selected `Caching Results`.
 */
const selectCachingResults = (
  state:
    | fromGames.State
    | fromClasses.State
    | fromWeeks.State
    | fromTables.State,
) => {
  const cachingResults = state.cachingResults;
  if (cachingResults.length === 0) {
    return [];
  }

  return [...cachingResults].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
};

// Games

/**
 * Selects all `Games`and sorts them by their date.
 */
export const selectAllGames = createSelector(selectGamesState, state =>
  fromGames
    .selectAllGames(state)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()),
);

/**
 * Selects all `Games` and returns them as an dictionary.
 */
export const selectGameEntities = createSelector(
  selectGamesState,
  fromGames.selectGameEntites,
);

/**
 * Selects all caching results from the `Games` feature.
 */
export const selectGamesCachingResults = createSelector(
  selectGamesState,
  selectCachingResults,
);

/**
 * Selects the cachingResultsLoading property of the `Games` state which shows
 * the `Caching Results` are currently loading or not.
 */
export const selectGamesCachingResultsLoading = createSelector(
  selectGamesState,
  fromGames.selectCachingResultsLoading,
);

/**
 * Selects the loading property of the `Games` state which shows if an loading
 * process is ongoing or not.
 */
export const selectIsGamesLoading = createSelector(
  selectGamesState,
  fromGames.selectIsLoading,
);

/**
 * Selects the loaded property of the `Games` state which shows if the
 * `Games` have been loaded or not.
 */
export const selectIsGamesLoaded = createSelector(
  selectGamesState,
  fromGames.selectIsLoaded,
);

// Classes

/**
 * Selects all `Classes` and returns them as an array.
 */
export const selectAllClasses = createSelector(
  selectClassesState,
  fromClasses.selectAllClasses,
);

/**
 * Selects all `Classes` and returns them as an dictionary.
 */
export const selectClassEntities = createSelector(
  selectClassesState,
  fromClasses.selectClassEntites,
);

/**
 * Selects a `Class` by the given id.
 */
export const selectClassById = createSelector(
  selectClassEntities,
  (classes: Dictionary<HvwClass>, id: string) => classes[id],
);

/**
 * Selects the `Caching Results` of the `Classes` caching processes.
 */
export const selectClassesCachingResults = createSelector(
  selectClassesState,
  selectCachingResults,
);

/**
 * Selects the cachingResultsLoading property of the `Classes` state which shows
 * the `Caching Results` are currently loading or not.
 */
export const selectClassesCachingResultsLoading = createSelector(
  selectClassesState,
  fromClasses.selectCachingResultsLoading,
);

/**
 * Selects the loading property of the `Classes` state which shows if an loading
 * process is ongoing or not.
 */
export const selectIsClassesLoading = createSelector(
  selectClassesState,
  fromClasses.selectIsLoading,
);

/**
 * Selects the loaded property of the `Classes` state which shows if the
 * `Classes` have been loaded or not.
 */
export const selectIsClassesLoaded = createSelector(
  selectClassesState,
  fromClasses.selectIsLoaded,
);

// Weeks

/**
 * Selects all `Weeks`, sorts them by their date and returns them as an array.
 */
export const selectAllWeeks = createSelector(selectWeeksState, state =>
  fromWeeks
    .selectAllWeeks(state)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()),
);

/**
 * Selects all `Weeks` and returns them as an dictionary.
 */
export const selectWeekEntities = createSelector(
  selectWeeksState,
  fromWeeks.selectWeekEntities,
);

/**
 * Selects the `Caching Results` of the `Weeks` caching processes.
 */
export const selectWeeksCachingResults = createSelector(
  selectWeeksState,
  selectCachingResults,
);

/**
 * Selects the cachingResultsLoading property of the `Weeks` state which shows
 * the `Caching Results` are currently loading or not.
 */
export const selectWeeksCachingResultsLoading = createSelector(
  selectWeeksState,
  fromWeeks.selectCachingResultsLoading,
);

/**
 * Selects the loading property of the `Weeks` state which shows if an loading
 * process is ongoing or not.
 */
export const selectIsWeeksLoading = createSelector(
  selectWeeksState,
  fromWeeks.selectIsLoading,
);

/**
 * Selects the loaded property of the `Weeks` state which shows if the
 * `Weeks` have been loaded or not.
 */
export const selectIsWeeksLoaded = createSelector(
  selectWeeksState,
  fromWeeks.selectIsLoaded,
);

// Tables

/**
 * Selects all `Tables` and returns them as an array.
 */
export const selectAllTables = createSelector(
  selectTablesState,
  fromTables.selectAllTables,
);

/**
 * Selects all `Tables` and returns them as an dictionary.
 */
export const selectTableEntities = createSelector(
  selectTablesState,
  fromTables.selectTableEntites,
);

/**
 * Selects the `Caching Results` of the `Tables` caching processes.
 */
export const selectTablesCachingResults = createSelector(
  selectTablesState,
  selectCachingResults,
);

/**
 * Selects the cachingResultsLoading property of the `Tables` state which shows
 * the `Caching Results` are currently loading or not.
 */
export const selectTablesCachingResultsLoading = createSelector(
  selectTablesState,
  fromTables.selectCachingResultsLoading,
);

/**
 * Selects the loading property of the `Tables` state which shows if an loading
 * process is ongoing or not.
 */
export const selectIsTablesLoading = createSelector(
  selectTablesState,
  fromTables.selectIsLoading,
);

/**
 * Selects the loaded property of the `Tables` state which shows if the `Tables`
 * have been loaded or not.
 */
export const selectIsTablesLoaded = createSelector(
  selectTablesState,
  fromTables.selectIsLoaded,
);

/**
 * Selects all `Jobs` and returns them as an array.
 */
export const selectAllJobs = createSelector(
  selectJobsState,
  fromJobs.selectAllJobs,
);

/**
 * Selects all `Jobs` and returns them as an dictionary.
 */
export const selectJobEntities = createSelector(
  selectJobsState,
  fromJobs.selectJobEntites,
);

/**
 * Selects all names of the stored `Jobs`.
 */
export const selectJobNames = createSelector(
  selectJobsState,
  fromJobs.selectJobNames,
);

/**
 * Selects the loading property of the `Jobs` state which shows if an loading
 * process is ongoing or not.
 */
export const selectIsJobsLoading = createSelector(
  selectJobsState,
  fromJobs.selectIsLoading,
);

/**
 * Selects the loaded property of the `Jobs` state which shows if the `Jobs`
 * have been loaded or not.
 */
export const selectIsJobsLoaded = createSelector(
  selectJobsState,
  fromJobs.selectIsLoaded,
);
