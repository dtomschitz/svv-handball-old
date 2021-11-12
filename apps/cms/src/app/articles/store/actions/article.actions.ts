import { Update } from '@ngrx/entity';
import { createAction, props } from '@ngrx/store';
import { Article } from '@svv/core/models';

export const CREATE_ARTICLE = '[Article] Create Article';
export const CREATE_ARTICLE_SUCCESS = '[Article] Create Article Success';
export const CREATE_ARTICLE_FAILURE = '[Article] Create Article Failure';

export const UPDATE_ARTICLE = '[Article] Update Article';
export const UPDATE_ARTICLE_SUCCESS = '[Article] Update Article Success';
export const UPDATE_ARTICLE_FAILURE = '[Article] Update Article Failure';

export const DELETE_ARTICLE = '[Article] Delete Article';
export const DELETE_ARTICLE_SUCCESS = '[Article] Delete Article Success';
export const DELETE_ARTICLE_FAILURE = '[Article] Delete Article Failure';

export const createArticle = createAction(
  CREATE_ARTICLE,
  props<{ article: Partial<Article> }>(),
);
export const createArticleSuccess = createAction(
  CREATE_ARTICLE_SUCCESS,
  props<{ article: Article }>(),
);
export const createArticleFailure = createAction(CREATE_ARTICLE_FAILURE);

export const updateArticle = createAction(
  UPDATE_ARTICLE,
  props<{ update: Update<Article> }>(),
);
export const updateArticleSuccess = createAction(
  UPDATE_ARTICLE_SUCCESS,
  props<{ update: Update<Article> }>(),
);
export const updateArticleFailure = createAction(UPDATE_ARTICLE_FAILURE);

export const deleteArticle = createAction(
  DELETE_ARTICLE,
  props<{ id: string }>(),
);
export const deleteArticleSuccess = createAction(
  DELETE_ARTICLE_SUCCESS,
  props<{ id: string }>(),
);
export const deleteArticleFailure = createAction(DELETE_ARTICLE_FAILURE);
