import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';
import { HvwCachingResult, HvwTable } from '@svv/core/models';
import { TablesActions } from '@svv/cms/hvw/store/actions';

/**
 * The global feature key of the `Tables` state.
 */
export const featureKey = 'tables';

export const adapter = createEntityAdapter<HvwTable>({
  selectId: table => table._id,
});

/**
 * Interface used to describe the `Tables` state.
 */
export interface State extends EntityState<HvwTable> {
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
  on(TablesActions.refreshTables, TablesActions.cacheTablesSuccess, state => ({
    ...state,
    loading: true,
    loaded: false,
  })),
  on(TablesActions.loadTables, TablesActions.cacheTables, state => ({
    ...state,
    loading: true,
  })),
  on(TablesActions.loadTablesSuccess, (state, { tables }) =>
    adapter.setAll(tables, { ...state, loading: false, loaded: true }),
  ),
  on(TablesActions.deleteTablesSuccess, state => adapter.removeAll(state)),
  on(
    TablesActions.loadTablesFailure,
    TablesActions.loadCachedTables,
    state => ({
      ...state,
      loading: false,
    }),
  ),
  on(TablesActions.loadTablesCachingResults, state => ({
    ...state,
    cachingResultsLoading: true,
  })),
  on(TablesActions.cacheTablesSuccess, (state, { cachingResult }) => ({
    ...state,
    cachingResults: [...state.cachingResults, cachingResult],
  })),
  on(
    TablesActions.loadTablesCachingResultsSuccess,
    (state, { cachingResults }) => ({
      ...state,
      cachingResults,
      cachingResultsLoading: false,
    }),
  ),
  on(TablesActions.loadTablesCachingResultsFailure, state => ({
    ...state,
    cachingResultsLoading: false,
  })),
);

/**
 * Default selectors for the `Tables` state.
 */
export const {
  selectEntities: selectTableEntites,
  selectAll: selectAllTables,
} = adapter.getSelectors();

/**
 * Selects the cachingResultsLoading property of the `Tables` state which shows
 * the `Caching Results` are currently loading or not.
 *
 * @param state The `Tables` state.
 */
export const selectCachingResultsLoading = (state: State) =>
  state.cachingResultsLoading;

/**
 * Selects the loading property of the `Tables` state which shows if an loading
 * process is ongoing or not.
 *
 * @param state The `Tables` state.
 */
export const selectIsLoading = (state: State) => state.loading;

/**
 * Selects the loaded property of the `Tables` state which shows if the `Tables`
 * have been loaded or not.
 *
 * @param state The `Tables` state.
 */
export const selectIsLoaded = (state: State) => state.loaded;
