import { createAction, props } from '@ngrx/store';
import { User } from '@svv/core/models';

export const LOAD_USERS = 'Load Users';
export const LOAD_USERS_SUCCESS = '[Users] Load Users Success';
export const LOAD_USERS_FAILURE = '[Users] Load Users Failure';
export const LOAD_USERS_CACHE = '[Users] Load Users Cache';

export const REFRESH_USERS = '[Users] Refresh Users';
export const REFRESH_USERS_SUCCESS = '[Users] Refresh Users Success';
export const REFRESH_USERS_FAILURE = '[Users] Refresh Users Failure';

export const loadUsers = createAction(LOAD_USERS);

export const loadUsersSuccess = createAction(
  LOAD_USERS_SUCCESS,
  props<{ users: User[] }>(),
);

export const loadUsersFailure = createAction(LOAD_USERS_FAILURE);

export const loadUsersCache = createAction(LOAD_USERS_CACHE);

export const refreshUsers = createAction('[Users] Refresh Users');

export const refreshUsersSuccess = createAction(
  REFRESH_USERS_SUCCESS,
  props<{ users: User[] }>(),
);

export const refreshUsersFailure = createAction(REFRESH_USERS_FAILURE);
