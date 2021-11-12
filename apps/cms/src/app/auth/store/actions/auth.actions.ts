import { createAction, props } from '@ngrx/store';
import { AuthTokens, Credentials, User } from '@svv/core/models';

export const loadAuthTokens = createAction(
  '[Auth] Load Jwt Tokens From Local Storage',
);

export const loadAuthTokensSuccess = createAction(
  '[Auth] Load Jwt Tokens From Local Storage Success',
  props<{ tokens: AuthTokens }>(),
);

export const loadAuthTokensFailure = createAction(
  '[Auth] Load Jwt Tokens From Local Storage Failure',
);

export const verifyAccessToken = createAction(
  '[Auth] Verify Refresh Token',
  props<{ tokens: AuthTokens }>(),
);

export const verifyAccessTokenSuccess = createAction(
  '[Auth] Verify Refresh Token Success',
  props<{ user: User }>(),
);

export const verifyAccessTokenFailure = createAction(
  '[Auth] Verify Refresh Token Failure',
  props<{ error: any }>(),
);

export const refreshAccessToken = createAction('[Auth] Refresh Access Token');

export const refreshAccessTokenSuccess = createAction(
  '[Auth] Refresh Access Token Success',
  props<{ accessToken: string }>(),
);

export const refreshAccessTokenFailure = createAction(
  '[Auth] LogRefresh Access Token Failure',
  props<{ error: any }>(),
);

export const login = createAction(
  '[Auth] Login',
  props<{ credentials: Credentials }>(),
);

export const loginSuccess = createAction(
  '[Auth] Login Success',
  props<{ user: User; tokens: AuthTokens }>(),
);

export const loginFailure = createAction('[Auth] Login Failure');

export const loginRedirect = createAction('[Auth] Login Redirect');

export const verifyRedirect = createAction('[Auth] Verify Redirect');

export const logout = createAction('[Auth] Logout');

export const logoutSuccess = createAction('[Auth] Logout Success');

export const logoutFailure = createAction('[Auth] Logout Failure');
