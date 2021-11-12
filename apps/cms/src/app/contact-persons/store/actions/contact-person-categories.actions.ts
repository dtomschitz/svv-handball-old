import { Update } from '@ngrx/entity';
import { createAction, props } from '@ngrx/store';
import { ContactPersonCategory } from '@svv/core/models';

export const LOAD_CONTACT_PERSON_CATEGORIES =
  '[ContactPersonCategories] Load ContactPersonCategories';
export const LOAD_CONTACT_PERSON_CATEGORIES_SUCCESS =
  '[ContactPersonCategories] Load ContactPersonCategories Success';
export const LOAD_CONTACT_PERSON_CATEGORIES_FAILURE =
  '[ContactPersonCategories] Load ContactPersonCategories Failure';
export const LOAD_CONTACT_PERSON_CATEGORIES_CACHE =
  '[ContactPersonCategories] Load ContactPersonCategories Cache';

export const SORT_CONTACT_PERSON_CATEGORIES =
  '[ContactPersonCategories] Sort ContactPersonCategories';
export const SORT_CONTACT_PERSON_CATEGORIES_SUCCESS =
  '[ContactPersonCategories] Sort ContactPersonCategories Success';
export const SORT_CONTACT_PERSON_CATEGORIES_FAILURE =
  '[ContactPersonCategories] Sort ContactPersonCategories Failure';

export const REFRESH_CONTACT_PERSON_CATEGORIES =
  '[ContactPersonCategories] Refresh ContactPersonCategories';

export const loadContactPersonCategories = createAction(
  LOAD_CONTACT_PERSON_CATEGORIES,
);
export const loadContactPersonCategoriesSuccess = createAction(
  LOAD_CONTACT_PERSON_CATEGORIES_SUCCESS,
  props<{ categories: ContactPersonCategory[] }>(),
);
export const loadContactPersonCategoriesFailure = createAction(
  LOAD_CONTACT_PERSON_CATEGORIES_FAILURE,
);
export const loadContactPersonCategoriesCache = createAction(
  LOAD_CONTACT_PERSON_CATEGORIES_CACHE,
);

export const sortContactPersonCategories = createAction(
  SORT_CONTACT_PERSON_CATEGORIES,
  props<{ updates: Update<ContactPersonCategory>[] }>(),
);
export const sortContactPersonCategoriesSuccess = createAction(
  SORT_CONTACT_PERSON_CATEGORIES_SUCCESS,
  props<{ updates: Update<ContactPersonCategory>[] }>(),
);
export const sortContactPersonCategoriesFailure = createAction(
  SORT_CONTACT_PERSON_CATEGORIES_FAILURE,
);

export const refreshContactPersonCategories = createAction(
  REFRESH_CONTACT_PERSON_CATEGORIES,
);
