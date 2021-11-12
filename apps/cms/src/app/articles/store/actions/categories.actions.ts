import { createAction, props } from '@ngrx/store';
import { ArticleCategory } from '@svv/core/models';

export const LOAD_CATEGORIES = '[Categories] Load Categories';
export const LOAD_CATEGORIES_SUCCESS = '[Categories] Load Categories Success';
export const LOAD_CATEGORIES_FAILURE = '[Categories] Load Categories Failure';
export const LOAD_CATEGORIES_CACHE = '[Categories] Load Categories Cache';

export const REFRESH_CATEGORIES = '[Categories] Refresh Categories';

export const loadCategories = createAction(LOAD_CATEGORIES);
export const loadCategoriesSuccess = createAction(
  LOAD_CATEGORIES_SUCCESS,
  props<{ categories: ArticleCategory[] }>(),
);
export const loadCategoriesFailure = createAction(LOAD_CATEGORIES_FAILURE);
export const loadCategoriesCache = createAction(LOAD_CATEGORIES_CACHE);

export const refreshCategories = createAction(REFRESH_CATEGORIES);
