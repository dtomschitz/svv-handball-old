import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';
import { HvwCachingResult, HvwClass } from '@svv/core/models';
import { ClassesActions } from '@svv/cms/hvw/store/actions';

/**
 * The global feature key of the `Classes` state.
 */
export const featureKey = 'classes';

export const adapter = createEntityAdapter<HvwClass>({
  selectId: clazz => clazz._id,
});

/**
 * Interface used to describe the `Classes` state.
 */
export interface State extends EntityState<HvwClass> {
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
  on(
    ClassesActions.refreshClasses,
    ClassesActions.cacheClassesSuccess,
    state => ({
      ...state,
      loading: true,
      loaded: false,
    }),
  ),
  on(ClassesActions.loadClasses, ClassesActions.cacheClasses, state => ({
    ...state,
    loading: true,
  })),
  on(ClassesActions.loadClassesSuccess, (state, { classes }) =>
    adapter.setAll(classes, { ...state, loading: false, loaded: true }),
  ),
  on(ClassesActions.deleteClassesSuccess, state => adapter.removeAll(state)),
  on(
    ClassesActions.loadClassesFailure,
    ClassesActions.loadCachedClasses,
    state => ({
      ...state,
      loading: false,
    }),
  ),
  on(ClassesActions.cacheClassesSuccess, (state, { cachingResult }) => ({
    ...state,
    cachingResults: [...state.cachingResults, cachingResult],
  })),
  on(ClassesActions.loadClassesCachingResults, state => ({
    ...state,
    cachingResultsLoading: true,
  })),
  on(
    ClassesActions.loadClassesCachingResultsSuccess,
    (state, { cachingResults }) => ({
      ...state,
      cachingResults,
      cachingResultsLoading: false,
    }),
  ),
  on(ClassesActions.loadClassesCachingResultsFailure, state => ({
    ...state,
    cachingResultsLoading: false,
  })),
);

/**
 * Default selectors for the `Classes` state.
 */
export const {
  selectEntities: selectClassEntites,
  selectAll: selectAllClasses,
} = adapter.getSelectors();

/**
 * Selects the cachingResultsLoading property of the `Classes` state which shows
 * the `Caching Results` are currently loading or not.
 *
 * @param state The `Classes` state.
 */
export const selectCachingResultsLoading = (state: State) =>
  state.cachingResultsLoading;

/**
 * Selects the loading property of the `Classes` state which shows if an loading
 * process is ongoing or not.
 *
 * @param state The `Classes` state.
 */
export const selectIsLoading = (state: State) => state.loading;

/**
 * Selects the loaded property of the `Classes` state which shows if the `Classes`
 * have been loaded or not.
 *
 * @param state The `Classes` state.
 */
export const selectIsLoaded = (state: State) => state.loaded;
