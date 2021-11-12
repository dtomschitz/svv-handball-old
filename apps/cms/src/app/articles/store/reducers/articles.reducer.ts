import { createReducer, createSelector, on } from '@ngrx/store';
import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { Article } from '@svv/core/models';
import {
  ArticleActions,
  ArticlesActions,
} from '@svv/cms/articles/store/actions';
import * as dayjs from 'dayjs';

/**
 * The global feature key of the `Articles` state.
 */
export const featureKey = 'articles';

export const adapter = createEntityAdapter<Article>({
  selectId: article => article._id,
  sortComparer: (a, b) => (dayjs(b.date).isAfter(dayjs(a.date)) ? 1 : -1),
});

/**
 * Interface used to describe the `Articles` state.
 */
export interface State extends EntityState<Article> {
  loading: boolean;
  loaded: boolean;
}

/**
 * Creates the reducer function for managing the `Articles` feature slice of
 * the root state.
 */
export const reducer = createReducer(
  adapter.getInitialState({
    loading: false,
    loaded: false,
  }),
  on(ArticlesActions.refreshArticles, state => ({
    ...state,
    loading: true,
    loaded: false,
  })),
  on(ArticlesActions.loadArticles, state => ({ ...state, loading: true })),
  on(ArticlesActions.loadArticlesSuccess, (state, { articles }) =>
    adapter.setAll(articles, { ...state, loading: false, loaded: true }),
  ),
  on(ArticleActions.createArticleSuccess, (state, { article }) =>
    adapter.addOne(article, state),
  ),
  on(ArticleActions.updateArticleSuccess, (state, { update }) =>
    adapter.updateOne(update, state),
  ),
  on(ArticleActions.deleteArticleSuccess, (state, { id }) =>
    adapter.removeOne(id, state),
  ),
  on(
    ArticlesActions.loadArticlesCache,
    ArticlesActions.loadArticlesFailure,
    state => ({
      ...state,
      loading: false,
    }),
  ),
);

/**
 * Default selectors for the `Articles` state.
 */
export const {
  selectEntities: selectArticleEntities,
  selectAll,
} = adapter.getSelectors();

/**
 * Selects all pinned `Articles` by their type.
 */
export const selectAllPinnedArticles = createSelector(selectAll, images =>
  images.filter(image => image.pinned),
);

/**
 * Selects all `Articles` by their type.
 */
export const selectAllArticles = createSelector(selectAll, images =>
  images.filter(image => !image.pinned),
);

/**
 * Selects the loading property of the `Articles` state which shows if an loading
 * process is ongoing or not.
 *
 * @param state The `Articles` state.
 */
export const selectIsLoading = (state: State) => state.loading;

/**
 * Selects the loaded property of the `Articles` state which shows if the `Articles`
 * have been loaded or not.
 *
 * @param state The `Articles` state.
 */
export const selectIsLoaded = (state: State) => state.loaded;
