import { Update } from '@ngrx/entity';
import { createAction, props } from '@ngrx/store';
import { Article } from '@svv/core/models';

export const LOAD_ARTICLES = '[Articles] Load Articles';
export const LOAD_ARTICLES_SUCCESS = '[Articles] Load Articles Success';
export const LOAD_ARTICLES_FAILURE = '[Articles] Load Articles Failure';
export const LOAD_ARTICLES_CACHE = '[Articles] Load Articles Cache';

export const UPDATE_ARTICLES = '[Articles] Update Articles';
export const UPDATE_ARTICLES_SUCCESS = '[Articles] Update Articles Success';
export const UPDATE_ARTICLES_FAILURE = '[Articles] Update Articles Failure';

export const REFRESH_ARTICLES = '[Articles] Refresh Articles';

export const loadArticles = createAction(LOAD_ARTICLES);
export const loadArticlesSuccess = createAction(
  LOAD_ARTICLES_SUCCESS,
  props<{ articles: Article[] }>(),
);
export const loadArticlesFailure = createAction(LOAD_ARTICLES_FAILURE);
export const loadArticlesCache = createAction(LOAD_ARTICLES_CACHE);

export const updateArticles = createAction(
  UPDATE_ARTICLES,
  props<{ updates: Update<Article>[] }>(),
);
export const updateArticlesSuccess = createAction(
  UPDATE_ARTICLES_SUCCESS,
  props<{ updates: Update<Article>[] }>(),
);
export const updateArticlesFailure = createAction(UPDATE_ARTICLES_FAILURE);

export const refreshArticles = createAction(REFRESH_ARTICLES);
