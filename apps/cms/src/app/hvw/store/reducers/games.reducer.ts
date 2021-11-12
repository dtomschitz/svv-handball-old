import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';
import { HvwGame, HvwCachingResult } from '@svv/core/models';
import { GamesActions } from '@svv/cms/hvw/store/actions';

/**
 * The global feature key of the `Games` state.
 */
export const featureKey = 'games';

export const adapter = createEntityAdapter<HvwGame>({
  selectId: game => game._id,
});

/**
 * Interface used to describe the `Games` state.
 */
export interface State extends EntityState<HvwGame> {
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
  on(GamesActions.refreshGames, GamesActions.cacheGamesSuccess, state => ({
    ...state,
    loading: true,
    loaded: false,
  })),
  on(GamesActions.loadGames, GamesActions.cacheGames, state => ({
    ...state,
    loading: true,
  })),
  on(GamesActions.loadGamesSuccess, (state, { games }) =>
    adapter.setAll(games, { ...state, loading: false, loaded: true }),
  ),
  on(GamesActions.deleteGamesSuccess, state => adapter.removeAll(state)),
  on(GamesActions.loadGamesFailure, GamesActions.loadCachedGames, state => ({
    ...state,
    loading: false,
  })),
  on(GamesActions.loadGamesCachingResults, state => ({
    ...state,
    cachingResultsLoading: true,
  })),
  on(GamesActions.cacheGamesSuccess, (state, { cachingResult }) => ({
    ...state,
    cachingResults: [...state.cachingResults, cachingResult],
  })),
  on(
    GamesActions.loadGamesCachingResultsSuccess,
    (state, { cachingResults }) => ({
      ...state,
      cachingResults,
      cachingResultsLoading: false,
    }),
  ),
  on(GamesActions.loadGamesCachingResultsFailure, state => ({
    ...state,
    cachingResultsLoading: false,
  })),
);

/**
 * Default selectors for the `Games` state.
 */
export const {
  selectEntities: selectGameEntites,
  selectAll: selectAllGames,
} = adapter.getSelectors();

/**
 * Selects the cachingResultsLoading property of the `Games` state which shows
 * the `Caching Results` are currently loading or not.
 *
 * @param state The `Games` state.
 */
export const selectCachingResultsLoading = (state: State) =>
  state.cachingResultsLoading;

/**
 * Selects the loading property of the `Games` state which shows if an loading
 * process is ongoing or not.
 *
 * @param state The `Games` state.
 */
export const selectIsLoading = (state: State) => state.loading;

/**
 * Selects the loaded property of the `Games` state which shows if the `Games`
 * have been loaded or not.
 *
 * @param state The `Games` state.
 */
export const selectIsLoaded = (state: State) => state.loaded;
