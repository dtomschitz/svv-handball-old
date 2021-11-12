import {
  Action,
  combineReducers,
  createFeatureSelector,
  createSelector,
} from '@ngrx/store';
import * as fromRoot from '@svv/cms/reducers';
import * as fromContactPersons from './contact-persons.reducer';
import * as fromCategories from './categories.reducer';

/**
 * The global feature key of the `Article` state.
 */
export const featureKey = 'contact-person';

/**
 * Interface used to describe the `Article` state.
 */
export interface ArticleState {
  [fromContactPersons.featureKey]: fromContactPersons.State;
  [fromCategories.featureKey]: fromCategories.State;
}

export interface State extends fromRoot.State {
  [featureKey]: ArticleState;
}

/**
 * Creates an combined reducer function for managing the `Article` feature slice
 * of the root state.
 */
export function reducers(state: ArticleState | undefined, action: Action) {
  return combineReducers<ArticleState, Action>({
    [fromContactPersons.featureKey]: fromContactPersons.reducer,
    [fromCategories.featureKey]: fromCategories.reducer,
  })(state, action);
}

/**
 * Selects the `Contact Person` state.
 */
export const selectContactPersonState = createFeatureSelector<
  State,
  ArticleState
>(featureKey);

/**
 * Selects the `Contact Persons` state.
 */
export const selectContactPersonsState = createSelector(
  selectContactPersonState,
  state => state[fromContactPersons.featureKey],
);

/**
 * Selects the `Contact Persons Categories` state.
 */
export const selectContactPersonCategoriesState = createSelector(
  selectContactPersonState,
  state => state[fromCategories.featureKey],
);

// Contact Persons

/**
 * Selects all `Contact Persons` and sorts them by their date.
 */
export const selectAllContactPersons = createSelector(
  selectContactPersonsState,
  fromContactPersons.selectAllContactPersons,
);

/**
 * Selects all `Contact Persons` and returns them as an dictionary.
 */
export const selectContactPersonEntities = createSelector(
  selectContactPersonsState,
  fromContactPersons.selectContactPersonEntities,
);

/**
 * Selects all titles of the stored `Contact Persons`.
 */
export const selectAllContactPersonNames = createSelector(
  selectContactPersonsState,
  fromContactPersons.selectAllContactPersonNames,
);

/**
 * Selects the loading property of the `Contact Persons` state which shows if an
 * loading process is ongoing or not.
 */
export const selectIsContactPersonsLoading = createSelector(
  selectContactPersonsState,
  fromContactPersons.selectIsLoading,
);

/**
 * Selects the loaded property of the `Contact Persons` state which shows if the
 * `ContactPersons` have been loaded or not.
 */
export const selectIsContactPersonsLoaded = createSelector(
  selectContactPersonsState,
  fromContactPersons.selectIsLoaded,
);

// Contact Person Categories

/**
 * Selects all `Contact Person Categories`.
 */
export const selectAllContactPersonCategories = createSelector(
  selectContactPersonCategoriesState,
  fromCategories.selectAllContactPersonCategories,
);

/**
 * Selects all names of the stored `Contact Person Categories`.
 */
export const selectAllContactPersonCategoryNames = createSelector(
  selectContactPersonCategoriesState,
  fromCategories.selectAllContactPersonCategoryNames,
);

/**
 * Selects the loading property of the `Contact Person Categories` state which
 * shows if an loading process is ongoing or not.
 */
export const selectIsContactPersonCategoriesLoading = createSelector(
  selectContactPersonCategoriesState,
  fromCategories.selectIsLoading,
);

/**
 * Selects the loaded property of the `Contact Person Categories` state which
 * shows if the `Contact Person Categories` have been loaded or not.
 */
export const selectIsContactPersonCategoriesLoaded = createSelector(
  selectContactPersonCategoriesState,
  fromCategories.selectIsLoaded,
);
