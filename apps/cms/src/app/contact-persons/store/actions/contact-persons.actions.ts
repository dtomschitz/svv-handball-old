import { Update } from '@ngrx/entity';
import { createAction, props } from '@ngrx/store';
import { ContactPerson } from '@svv/core/models';

export const LOAD_CONTACT_PERSONS = '[ContactPersons] Load Contact Persons';
export const LOAD_CONTACT_PERSONS_SUCCESS =
  '[ContactPersons] Load Contact Persons Success';
export const LOAD_CONTACT_PERSONS_FAILURE =
  '[ContactPersons] Load Contact Persons Failure';
export const LOAD_CONTACT_PERSONS_CACHE =
  '[ContactPersons] Load Contact Persons Cache';

export const REFRESH_CONTACT_PERSONS =
  '[ContactPersons] Refresh Contact Persons';

export const SORT_CONTACT_PERSONS = '[ContactPersons] Update Contact Persons';
export const SORT_CONTACT_PERSONS_SUCCESS =
  '[ContactPersons] Update Contact Persons Success';
export const SORT_CONTACT_PERSONS_FAILURE =
  '[ContactPersons] Update Contact Persons Failure';

export const loadContactPersons = createAction(LOAD_CONTACT_PERSONS);
export const loadContactPersonsSuccess = createAction(
  LOAD_CONTACT_PERSONS_SUCCESS,
  props<{ contactPersons: ContactPerson[] }>(),
);
export const loadContactPersonsFailure = createAction(
  LOAD_CONTACT_PERSONS_FAILURE,
);
export const loadContactPersonsCache = createAction(LOAD_CONTACT_PERSONS_CACHE);

export const refreshContactPersons = createAction(REFRESH_CONTACT_PERSONS);

export const sortContactPersons = createAction(
  SORT_CONTACT_PERSONS,
  props<{ updates: Update<ContactPerson>[] }>(),
);
export const sortContactPersonsSuccess = createAction(
  SORT_CONTACT_PERSONS_SUCCESS,
  props<{ updates: Update<ContactPerson>[] }>(),
);
export const sortContactPersonsFailure = createAction(
  SORT_CONTACT_PERSONS_FAILURE,
);
