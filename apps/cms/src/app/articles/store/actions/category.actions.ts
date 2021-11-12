import { Update } from '@ngrx/entity';
import { createAction, props } from '@ngrx/store';
import { ArticleCategory } from '@svv/core/models';

export const CREATE_CATEGORY = '[Category] Create Category';
export const CREATE_CATEGORY_SUCCESS = '[Category] Create Category Success';
export const CREATE_CATEGORY_FAILURE = '[Category] Create Category Failure';

export const UPDATE_CATEGORY = '[Category] Update Category';
export const UPDATE_CATEGORY_SUCCESS = '[Category] Update Category Success';
export const UPDATE_CATEGORY_FAILURE = '[Category] Update Category Failure';

export const DELETE_CATEGORY = '[Category] Delete Category';
export const DELETE_CATEGORY_SUCCESS = '[Category] Delete Category Success';
export const DELETE_CATEGORY_FAILURE = '[Category] Delete Category Failure';

export const createCategory = createAction(
  CREATE_CATEGORY,
  props<{ category: Partial<ArticleCategory> }>(),
);
export const createCategorySuccess = createAction(
  CREATE_CATEGORY_SUCCESS,
  props<{ category: ArticleCategory }>(),
);
export const createCategoryFailure = createAction(CREATE_CATEGORY_FAILURE);

export const updateCategory = createAction(
  UPDATE_CATEGORY,
  props<{ update: Update<ArticleCategory> }>(),
);
export const updateCategorySuccess = createAction(
  UPDATE_CATEGORY_SUCCESS,
  props<{ update: Update<ArticleCategory> }>(),
);
export const updateCategoryFailure = createAction(UPDATE_CATEGORY_FAILURE);

export const deleteCategory = createAction(
  DELETE_CATEGORY,
  props<{ id: string }>(),
);
export const deleteCategorySuccess = createAction(
  DELETE_CATEGORY_SUCCESS,
  props<{ id: string }>(),
);
export const deleteCategoryFailure = createAction(DELETE_CATEGORY_FAILURE);
