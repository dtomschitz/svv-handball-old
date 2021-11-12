import { createReducer, createSelector, on } from '@ngrx/store';
import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { ContactPersonCategory } from '@svv/core/models';
import {
  ContactPersonCategoryActions,
  ContactPersonCategoriesActions,
} from '@svv/cms/contact-persons/store/actions';

/**
 * The global feature key of the `Contact Person Categories` state.
 */
export const featureKey = 'categories';

export const adapter = createEntityAdapter<ContactPersonCategory>({
  selectId: category => category._id,
  sortComparer: (a, b) => a.position - b.position,
});

/**
 * Interface used to describe the `Contact Person Categories` state.
 */
export interface State extends EntityState<ContactPersonCategory> {
  loading: boolean;
  loaded: boolean;
}

/**
 * Creates the reducer function for managing the `Contact Person Categories`
 * feature slice of the root state.
 */
export const reducer = createReducer(
  adapter.getInitialState({
    loading: false,
    loaded: false,
  }),
  on(ContactPersonCategoriesActions.refreshContactPersonCategories, state => ({
    ...state,
    loading: true,
    loaded: false,
  })),
  on(ContactPersonCategoriesActions.loadContactPersonCategories, state => ({
    ...state,
    loading: true,
  })),
  on(
    ContactPersonCategoriesActions.loadContactPersonCategoriesSuccess,
    (state, { categories }) =>
      adapter.setAll(categories, { ...state, loading: false, loaded: true }),
  ),
  on(
    ContactPersonCategoryActions.createContactPersonCategorySuccess,
    (state, { category }) => adapter.addOne(category, state),
  ),
  on(
    ContactPersonCategoryActions.updateContactPersonCategorySuccess,
    (state, { update }) => adapter.updateOne(update, state),
  ),
  on(
    ContactPersonCategoriesActions.sortContactPersonCategoriesSuccess,
    (state, { updates }) => adapter.updateMany(updates, state),
  ),
  on(
    ContactPersonCategoryActions.deleteContactPersonCategorySuccess,
    (state, { id }) => adapter.removeOne(id, state),
  ),
  on(
    ContactPersonCategoriesActions.loadContactPersonCategoriesCache,
    ContactPersonCategoriesActions.loadContactPersonCategoriesFailure,
    state => ({
      ...state,
      loading: false,
    }),
  ),
);

/**
 * Default selectors for the `Contact Person Categories` state.
 */
export const {
  selectEntities: selectCategoryEntities,
  selectAll: selectAllContactPersonCategories,
} = adapter.getSelectors();

/**
 * Selects all names of the stored `Contact Person Categories`.
 */
export const selectAllContactPersonCategoryNames = createSelector(
  selectAllContactPersonCategories,
  category => category.map(category => category.name),
);

/**
 * Selects the loading property of the `Contact Person Categories` state which
 * shows if an loading  process is ongoing or not.
 *
 * @param state The `Contact Person Categories` state.
 */
export const selectIsLoading = (state: State) => state.loading;

/**
 * Selects the loaded property of the `Contact Person Categories` state which
 * shows if the `Contact Person Categories` have been loaded or not.
 *
 * @param state The `Contact Person Categories` state.
 */
export const selectIsLoaded = (state: State) => state.loaded;
