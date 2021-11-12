import { Update as ContactPersonCategoryActions } from '@ngrx/entity';
import { createAction, props } from '@ngrx/store';
import { ContactPerson } from '@svv/core/models';

export const CREATE_CONTACT_PERSON = '[ContactPerson] Create Contact Person';
export const CREATE_CONTACT_PERSON_SUCCESS =
  '[ContactPerson] Create Contact Person Success';
export const CREATE_CONTACT_PERSON_FAILURE =
  '[ContactPerson] Create Contact Person Failure';

export const UPDATE_CONTACT_PERSON = '[ContactPerson] Update Contact Person';
export const UPDATE_CONTACT_PERSON_SUCCESS =
  '[ContactPerson] Update Contact Person Success';
export const UPDATE_CONTACT_PERSON_FAILURE =
  '[ContactPerson] Update Contact Person Failure';

export const DELETE_CONTACT_PERSON = '[ContactPerson] Delete Contact Person';
export const DELETE_CONTACT_PERSON_SUCCESS =
  '[ContactPerson] Delete Contact Person Success';
export const DELETE_CONTACT_PERSON_FAILURE =
  '[ContactPerson] Delete Contact Person Failure';

export const createContactPerson = createAction(
  CREATE_CONTACT_PERSON,
  props<{ contactPerson: Partial<ContactPerson> }>(),
);
export const createContactPersonSuccess = createAction(
  CREATE_CONTACT_PERSON_SUCCESS,
  props<{ contactPerson: ContactPerson }>(),
);
export const createContactPersonFailure = createAction(
  CREATE_CONTACT_PERSON_FAILURE,
);

export const updateContactPerson = createAction(
  UPDATE_CONTACT_PERSON,
  props<{ update: ContactPersonCategoryActions<ContactPerson> }>(),
);
export const updateContactPersonSuccess = createAction(
  UPDATE_CONTACT_PERSON_SUCCESS,
  props<{ update: ContactPersonCategoryActions<ContactPerson> }>(),
);
export const updateContactPersonFailure = createAction(
  UPDATE_CONTACT_PERSON_FAILURE,
);

export const deleteContactPerson = createAction(
  DELETE_CONTACT_PERSON,
  props<{ id: string }>(),
);
export const deleteContactPersonSuccess = createAction(
  DELETE_CONTACT_PERSON_SUCCESS,
  props<{ id: string }>(),
);
export const deleteContactPersonFailure = createAction(
  DELETE_CONTACT_PERSON_FAILURE,
);
