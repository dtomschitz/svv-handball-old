import { Update } from '@ngrx/entity';
import { createAction, props } from '@ngrx/store';
import { User } from '@svv/core/models';

export const CREATE_USER = '[User] Create User';
export const CREATE_USER_SUCESS = '[User] Create User Success';
export const CREATE_USER_FAILURE = '[User] Create User Failure';

export const UPDATE_USER = '[User] Update User';
export const UPDATE_USER_SUCESS = '[User] Update User Success';
export const UPDATE_USER_FAILURE = '[User] Update User Failure';

export const DELETE_USER = '[User] Delete User';
export const DELETE_USER_SUCESS = '[User] Delete User Success';
export const DELETE_USER_FAILURE = '[User] Delete User Failure';

export const createUser = createAction(
  CREATE_USER,
  props<{ user: Partial<User> }>(),
);

export const createUserSuccess = createAction(
  CREATE_USER_SUCESS,
  props<{ user: User }>(),
);

export const createUserFailure = createAction(CREATE_USER_FAILURE);

export const updateUser = createAction(
  UPDATE_USER,
  props<{ update: Update<User> }>(),
);

export const updateUserSuccess = createAction(
  UPDATE_USER_SUCESS,
  props<{ update: Update<User> }>(),
);

export const updateUserFailure = createAction(UPDATE_USER_FAILURE);

export const deleteUser = createAction(DELETE_USER, props<{ id: string }>());

export const deleteUserSuccess = createAction(
  DELETE_USER_SUCESS,
  props<{ id: string }>(),
);

export const deleteUserFailure = createAction(DELETE_USER_FAILURE);
