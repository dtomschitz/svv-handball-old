import { createReducer, on } from '@ngrx/store';
import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { ArticleCategory } from '@svv/core/models';
import {
  CategoryActions,
  CategoriesActions,
} from '@svv/cms/articles/store/actions';

/**
 * The global feature key of the `Article Categories` state.
 */
export const featureKey = 'categories';

export const adapter = createEntityAdapter<ArticleCategory>({
  selectId: category => category._id,
  sortComparer: (a, b) => a.name.localeCompare(b.name),
});

/**
 * Interface used to describe the `Article Categories` state.
 */
export interface State extends EntityState<ArticleCategory> {
  loading: boolean;
  loaded: boolean;
}

/**
 * Creates the reducer function for managing the `Article Categories` feature
 * slice of the root state.
 */
export const reducer = createReducer(
  adapter.getInitialState({
    loading: false,
    loaded: false,
  }),
  on(CategoriesActions.refreshCategories, state => ({
    ...state,
    loading: true,
    loaded: false,
  })),
  on(CategoriesActions.loadCategories, state => ({ ...state, loading: true })),
  on(CategoriesActions.loadCategoriesSuccess, (state, { categories }) =>
    adapter.setAll(categories, { ...state, loading: false, loaded: true }),
  ),
  on(CategoryActions.createCategorySuccess, (state, { category }) =>
    adapter.addOne(category, state),
  ),
  on(CategoryActions.updateCategorySuccess, (state, { update }) =>
    adapter.updateOne(update, state),
  ),
  on(CategoryActions.deleteCategorySuccess, (state, { id }) =>
    adapter.removeOne(id, state),
  ),
  on(
    CategoriesActions.loadCategoriesCache,
    CategoriesActions.loadCategoriesFailure,
    state => ({
      ...state,
      loading: false,
    }),
  ),
);

/**
 * Default selectors for the `Article Categories` state.
 */
export const {
  selectEntities: selectCategoryEntities,
  selectAll: selectAllCategories,
} = adapter.getSelectors();

/**
 * Selects the loading property of the `Article Categories` state which shows
 * if an loading  process is ongoing or not.
 *
 * @param state The `Article Categories` state.
 */
export const selectIsLoading = (state: State) => state.loading;

/**
 * Selects the loaded property of the `Article Categories` state which shows if
 * the `Article Categories` have been loaded or not.
 *
 * @param state The `Article Categories` state.
 */
export const selectIsLoaded = (state: State) => state.loaded;
