import {
  createFeatureSelector,
  createReducer,
  createSelector,
  on,
} from '@ngrx/store';
import { User, AuthTokens } from '@svv/core/models';
import { AuthActions } from '../actions';
import * as fromRoot from '@svv/cms/reducers';

/**
 * The global feature key of the `Authentication` state.
 */
export const featureKey = 'auth';

/**
 * Interface used to describe the `Authentication` state.
 */
export interface AuthState {
  user: User;
  tokens: AuthTokens;
  pending: boolean;
  verifying: boolean;
}

export interface State extends fromRoot.State {
  [featureKey]: AuthState;
}

export const initialState: AuthState = {
  user: undefined,
  tokens: undefined,
  pending: false,
  verifying: false,
};

/**
 * Creates the reducer function for managing the `User` feature slice of
 * the root state.
 */
export const reducer = createReducer(
  initialState,
  on(AuthActions.loadAuthTokensSuccess, (state, { tokens }) => ({
    ...state,
    tokens,
  })),
  on(AuthActions.verifyAccessToken, state => ({
    ...state,
    verifying: true,
  })),
  on(AuthActions.verifyAccessTokenSuccess, (state, { user }) => ({
    ...state,
    verifying: false,
    user,
  })),
  on(AuthActions.verifyAccessTokenFailure, state => ({
    ...state,
    verifying: false,
  })),
  on(AuthActions.refreshAccessTokenSuccess, (state, { accessToken }) => ({
    ...state,
    tokens: {
      ...state.tokens,
      accessToken,
    },
  })),
  on(AuthActions.login, state => ({
    ...state,
    pending: true,
  })),
  on(AuthActions.loginSuccess, (state, { user, tokens }) => ({
    ...state,
    user,
    tokens,
    pending: false,
  })),
  on(AuthActions.loginFailure, state => ({
    ...state,
    pending: false,
  })),
  on(AuthActions.logoutSuccess, () => initialState),
);

/**
 * Selects the `Authentication` state.
 */
export const selectAuthState = createFeatureSelector<State, AuthState>(
  featureKey,
);

/**
 * Selects the currently logged in `User`.
 */
export const selectUser = createSelector(selectAuthState, state => state.user);

/**
 * Selects the authentication tokens of the currently logged in `User`.
 */
export const selectAuthTokens = createSelector(
  selectAuthState,
  state => state.tokens,
);

/**
 * Selects the authentication access token of the currently logged in `User`.
 */
export const selectAccessToken = createSelector(
  selectAuthTokens,
  tokens => tokens && tokens.accessToken,
);

/**
 * Selects the authentication refresh token of the currently logged in `User`.
 */
export const selectRefreshToken = createSelector(
  selectAuthTokens,
  tokens => tokens && tokens.refreshToken,
);

export const selectIsLoggedIn = createSelector(
  selectAuthState,
  state => !!state.user,
);

/**
 * Selects the pending property of the `Authentication` state which shows if an
 * authentication is pending or not.
 */
export const selectIsAuthPending = createSelector(
  selectAuthState,
  state => state.pending,
);

/**
 * Selects the verifying property of the `Authentication` state which shows if an
 * access token is currently in the verification process.
 */
export const selectIsVerifying = createSelector(
  selectAuthState,
  state => state.verifying,
);
