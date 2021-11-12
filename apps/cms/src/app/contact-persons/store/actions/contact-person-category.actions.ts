import { Update } from '@ngrx/entity';
import { createAction, props } from '@ngrx/store';
import { ContactPersonCategory } from '@svv/core/models';

export const CREATE_CONTACT_PERSON_CATEGORY =
  '[ContactPersonCategory] Create Contact Person';
export const CREATE_CONTACT_PERSON_CATEGORY_SUCCESS =
  '[ContactPersonCategory] Create Contact Person Success';
export const CREATE_CONTACT_PERSON_CATEGORY_FAILURE =
  '[ContactPersonCategory] Create Contact Person Failure';

export const UPDATE_CONTACT_PERSON_CATEGORY =
  '[ContactPersonCategory] Update Contact Person';
export const UPDATE_CONTACT_PERSON_CATEGORY_SUCCESS =
  '[ContactPersonCategory] Update Contact Person Success';
export const UPDATE_CONTACT_PERSON_CATEGORY_FAILURE =
  '[ContactPersonCategory] Update Contact Person Failure';

export const DELETE_CONTACT_PERSON_CATEGORY =
  '[ContactPersonCategory] Delete Contact Person';
export const DELETE_CONTACT_PERSON_CATEGORY_SUCCESS =
  '[ContactPersonCategory] Delete Contact Person Success';
export const DELETE_CONTACT_PERSON_CATEGORY_FAILURE =
  '[ContactPersonCategory] Delete Contact Person Failure';

export const createContactPersonCategory = createAction(
  CREATE_CONTACT_PERSON_CATEGORY,
  props<{ category: Partial<ContactPersonCategory> }>(),
);
export const createContactPersonCategorySuccess = createAction(
  CREATE_CONTACT_PERSON_CATEGORY_SUCCESS,
  props<{ category: ContactPersonCategory }>(),
);
export const createContactPersonCategoryFailure = createAction(
  CREATE_CONTACT_PERSON_CATEGORY_FAILURE,
);

export const updateContactPersonCategory = createAction(
  UPDATE_CONTACT_PERSON_CATEGORY,
  props<{ update: Update<ContactPersonCategory> }>(),
);
export const updateContactPersonCategorySuccess = createAction(
  UPDATE_CONTACT_PERSON_CATEGORY_SUCCESS,
  props<{ update: Update<ContactPersonCategory> }>(),
);
export const updateContactPersonCategoryFailure = createAction(
  UPDATE_CONTACT_PERSON_CATEGORY_FAILURE,
);

export const deleteContactPersonCategory = createAction(
  DELETE_CONTACT_PERSON_CATEGORY,
  props<{ id: string }>(),
);
export const deleteContactPersonCategorySuccess = createAction(
  DELETE_CONTACT_PERSON_CATEGORY_SUCCESS,
  props<{ id: string }>(),
);
export const deleteContactPersonCategoryFailure = createAction(
  DELETE_CONTACT_PERSON_CATEGORY_FAILURE,
);
