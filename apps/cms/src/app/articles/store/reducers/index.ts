import {
  Action,
  combineReducers,
  createFeatureSelector,
  createSelector,
} from '@ngrx/store';
import * as fromRoot from '@svv/cms/reducers';
import * as fromArticles from './articles.reducer';
import * as fromCategories from './categories.reducer';

/**
 * The global feature key of the `Article` state.
 */
export const featureKey = 'article';

/**
 * Interface used to describe the `Article` state.
 */
export interface ArticleState {
  [fromArticles.featureKey]: fromArticles.State;
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
    [fromArticles.featureKey]: fromArticles.reducer,
    [fromCategories.featureKey]: fromCategories.reducer,
  })(state, action);
}

/**
 * Selects the `Article` state.
 */
export const selectArticleState = createFeatureSelector<State, ArticleState>(
  featureKey,
);

/**
 * Selects the `Articles` state.
 */
export const selectArticlesState = createSelector(
  selectArticleState,
  state => state[fromArticles.featureKey],
);

/**
 * Selects the `Article Categories` state.
 */
export const selectCategoriesState = createSelector(
  selectArticleState,
  state => state[fromCategories.featureKey],
);

// Articles

/**
 * Selects all `Articles` and sorts them by their date.
 */
export const selectAllArticles = createSelector(
  selectArticlesState,
  fromArticles.selectAllArticles,
);

/**
 * Selects all pinned `Articles` and sorts them by their date.
 */
export const selectAllPinnedArticles = createSelector(
  selectArticlesState,
  fromArticles.selectAllPinnedArticles,
);

/**
 * Selects all `Articles` and returns them as an dictionary.
 */
export const selectArticleEntities = createSelector(
  selectArticlesState,
  fromArticles.selectArticleEntities,
);

/**
 * Selects all titles of the stored `Articles`.
 */
export const selectAllArticleTitles = createSelector(
  selectAllArticles,
  articles => articles.map(article => article.title),
);

/**
 * Selects the loading property of the `Articles` state which shows if an loading
 * process is ongoing or not.
 */
export const selectIsArticlesLoading = createSelector(
  selectArticlesState,
  fromArticles.selectIsLoading,
);

/**
 * Selects the loaded property of the `Articles` state which shows if the
 * `Articles` have been loaded or not.
 */
export const selectIsArticlesLoaded = createSelector(
  selectArticlesState,
  fromArticles.selectIsLoaded,
);

// Article Categories

/**
 * Selects all `Article Categories`.
 */
export const selectAllCategories = createSelector(
  selectCategoriesState,
  fromCategories.selectAllCategories,
);

/**
 * Selects all names of the stored `Article Categories`.
 */
export const selectAllCategoryNames = createSelector(
  selectAllCategories,
  categories => categories.map(category => category.name),
);

/**
 * Selects the loading property of the `Article Categories` state which shows if
 * an loading process is ongoing or not.
 */
export const selectIsArticleCategoriesLoading = createSelector(
  selectCategoriesState,
  fromCategories.selectIsLoading,
);

/**
 * Selects the loaded property of the `Article Categories` state which shows if
 * the `Article Categories` have been loaded or not.
 */
export const selectIsArticleCategoriesLoaded = createSelector(
  selectCategoriesState,
  fromCategories.selectIsLoaded,
);
