import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';
import { HvwCachingResult, HvwWeek } from '@svv/core/models';
import { WeeksActions } from '@svv/cms/hvw/store/actions';

/**
 * The global feature key of the `Weeks` state.
 */
export const featureKey = 'weeks';

/**
 * Interface used to describe the `Weeks` state.
 */
export const adapter = createEntityAdapter<HvwWeek>({
  selectId: week => week._id,
});

export interface State extends EntityState<HvwWeek> {
  loading: boolean;
  loaded: boolean;
  cachingResults: HvwCachingResult[];
  cachingResultsLoading: boolean;
}

/**
 * Creates the reducer function for managing the `User` feature slice of
 * the root state.
 */
export const reducer = createReducer(
  adapter.getInitialState({
    loading: false,
    loaded: false,
    cachingResultsLoading: false,
    cachingResults: [],
  }),
  on(WeeksActions.refreshWeeks, state => ({
    ...state,
    loading: true,
    loaded: false,
  })),
  on(WeeksActions.loadWeeks, WeeksActions.cacheWeeks, state => ({
    ...state,
    loading: true,
  })),
  on(WeeksActions.loadWeeksSuccess, (state, { weeks }) => {
    return adapter.setAll(weeks, {
      ...state,
      loading: false,
      loaded: true,
    });
  }),
  on(WeeksActions.deleteWeeksSuccess, state => adapter.removeAll(state)),
  on(WeeksActions.loadWeeksFailure, WeeksActions.loadCachedWeeks, state => ({
    ...state,
    loading: false,
  })),
  on(WeeksActions.cacheWeeksSuccess, (state, { cachingResult }) => ({
    ...state,
    cachingResults: [...state.cachingResults, cachingResult],
  })),
  on(WeeksActions.loadWeeksCachingResults, state => ({
    ...state,
    cachingResultsLoading: true,
  })),
  on(
    WeeksActions.loadWeeksCachingResultsSuccess,
    (state, { cachingResults }) => ({
      ...state,
      cachingResults,
      cachingResultsLoading: false,
    }),
  ),
  on(WeeksActions.loadWeeksCachingResultsFailure, state => ({
    ...state,
    cachingResultsLoading: false,
  })),
);

/**
 * Default selectors for the `Weeks` state.
 */
export const {
  selectAll: selectAllWeeks,
  selectEntities: selectWeekEntities,
  selectTotal: selectWeeksTotal,
} = adapter.getSelectors();

/**
 * Selects the cachingResultsLoading property of the `Weeks` state which shows
 * the `Caching Results` are currently loading or not.
 *
 * @param state The `Weeks` state.
 */
export const selectCachingResultsLoading = (state: State) =>
  state.cachingResultsLoading;

/**
 * Selects the loading property of the `Weeks` state which shows if an loading
 * process is ongoing or not.
 *
 * @param state The `Weeks` state.
 */
export const selectIsLoading = (state: State) => state.loading;

/**
 * Selects the loaded property of the `Weeks` state which shows if the `Weeks`
 * have been loaded or not.
 *
 * @param state The `Weeks` state.
 */
export const selectIsLoaded = (state: State) => state.loaded;
