import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { of } from 'rxjs';
import {
  catchError,
  concatMap,
  delay,
  map,
  switchMap,
  tap,
  withLatestFrom,
} from 'rxjs/operators';
import { createGenericEffect } from '@svv/cms/core/store/effects';
import { LayoutActions, RouterActions } from '@svv/cms/core/store/actions';
import { AuthDialogService, AuthService } from '@svv/cms/auth/services';
import { AuthActions } from '@svv/cms/auth/store/actions';
import * as fromAuth from '@svv/cms/auth/store/reducers';

@Injectable()
export class AuthEffects {
  /**
   * This effect listens to the `loadAuthTokens` action and will try to load the
   * authentication tokens from the local storage.
   *
   * In case the authentication tokens have been loaded successfully the
   * `loadAuthTokensSuccess` action containg the access and refresh token will
   * be dispatched. If the access and refresh token is not saved in the
   * localstorage of the browser the `loadAuthTokensFailure` action
   * gets dispatched.
   */
  loadAuthTokensFromLocalStorage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.loadAuthTokens),
      map(() => {
        const accessToken = this.authService.getAccessToken();
        const refreshToken = this.authService.getRefreshToken();

        if (accessToken && refreshToken) {
          return AuthActions.loadAuthTokensSuccess({
            tokens: { accessToken, refreshToken },
          });
        }

        return AuthActions.loadAuthTokensFailure();
      }),
    ),
  );

  /**
   * This effect listens to the `loadAuthTokensSuccess` action and will dispatch
   * the `verifyAccessToken` action in order to start the verification process
   * of the given access token.
   */
  loadAuthTokensSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.loadAuthTokensSuccess),
      map(({ tokens }) => AuthActions.verifyAccessToken({ tokens })),
    ),
  );

  /**
   * This effect listens to the `verifyAccessToken` action and will try to
   * verfiy the given access token by using the stored refresh token.
   *
   * In case the refresh token has been verified successfully the
   * `verifyAccessTokenSuccess` will be dispatched in order to set the `User` in
   * the global application state. Otherwise if an error occured while verifing,
   * the `verifyAccessTokenFailure` action gets dispatched.
   */
  verifyAccessToken$ = createGenericEffect(
    this.actions$,
    AuthActions.verifyAccessToken,
    action => this.authService.verify(action.tokens.refreshToken),
    () => ({
      success: user => AuthActions.verifyAccessTokenSuccess({ user }),
      failure: error =>
        AuthActions.verifyAccessTokenFailure({ error: error.message }),
    }),
    {
      delay: 500,
    },
  )();

  /**
   * This effect listens to the `verifyAccessTokenSuccess` action and will try
   * to open the Sidenav if the access token has been verified.
   */
  verifyAccessTokenSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.verifyAccessTokenSuccess),
      switchMap(() => [
        LayoutActions.openSidenav(),
        RouterActions.navigate({
          path: [localStorage.getItem('route') ?? '/'],
        }),
      ]),
    ),
  );

  /**
   * This effect listens to the `verifyAccessTokenFailure` action and will try
   * to remove the access tokens from the local storage.
   */
  verifyAccessTokenFailure$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        AuthActions.verifyAccessTokenFailure,
        AuthActions.loadAuthTokensFailure,
      ),
      tap(() => this.authService.removeTokens()),
      map(() => AuthActions.loginRedirect()),
    ),
  );

  /**
   * This effect listens to the `refreshAccessToken` action and will try to
   * refresh the currently stored access token by using the refresh token.
   *
   * In case the login was successful the `refreshAccessTokenSuccess` action
   * containg the new generated access token will be dispatched. Otherwise if an
   * error occured while refreshing, the `refreshAccessTokenFailure` action
   * gets dispatched.
   */
  refreshAccessToken$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.refreshAccessToken),
      concatMap(action =>
        of(action).pipe(
          withLatestFrom(this.store.pipe(select(fromAuth.selectRefreshToken))),
        ),
      ),
      switchMap(([, refreshToken]) =>
        this.authService.refreshAccessToken(refreshToken).pipe(
          map(({ accessToken }) =>
            AuthActions.refreshAccessTokenSuccess({ accessToken }),
          ),
          catchError(error =>
            of(AuthActions.refreshAccessTokenFailure({ error: error.message })),
          ),
        ),
      ),
    ),
  );

  /**
   * This effect listens to the `login` action and will try to login the `User`
   * with the given credentials.
   *
   * In case the login was successful the `loginSuccess` action containg the
   * `User` and the authentication tokens will be dispatched. Otherwise if an
   * error occured while verifing, the `loginFailure` action gets dispatched.
   */
  login$ = createGenericEffect(
    this.actions$,
    AuthActions.login,
    action => this.authService.login(action.credentials),
    () => ({
      success: ({ user, tokens }) => AuthActions.loginSuccess({ user, tokens }),
      failure: () => AuthActions.loginFailure(),
    }),
    {
      delay: 500,
    },
  )();

  /**
   * This effect listens to the `loginSuccess` action and will try to route the
   * `User` to the `Dashbord` page.
   */
  loginSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.loginSuccess),
      switchMap(() => [
        RouterActions.navigate({ path: ['/'] }),
        LayoutActions.openSidenav(),
      ]),
    ),
  );

  /**
   * This effect listens to the `loginRedirect` action and will try to route the
   * `User` to the `Login` page.
   */
  redirects$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.loginRedirect, AuthActions.verifyRedirect),
      switchMap(action => {
        return [
          RouterActions.navigate({
            path: [
              action.type === AuthActions.loginRedirect.type
                ? 'login'
                : 'verify',
            ],
          }),
          LayoutActions.closeSidenav(),
        ];
      }),
    ),
  );

  /**
   * This effect listens to the `logout` action and will try to logout the
   * currently logged in `User`.
   *
   * In case the logout was successful the `logoutSuccess` action will be
   * dispatched. Otherwise if an error occured while verifing,
   * the `logoutFailure` action gets dispatched.
   */
  logout$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.logout),
      concatMap(action =>
        of(action).pipe(
          withLatestFrom(this.store.pipe(select(fromAuth.selectUser))),
        ),
      ),
      map(([, user]) => user),
      switchMap(user => {
        this.authDialogService.showLogoutDialog();

        return this.authService.logout(user).pipe(
          map(() => AuthActions.logoutSuccess()),
          catchError(() => of(AuthActions.logoutFailure())),
        );
      }),
    ),
  );

  /**
   * This effect listens to the `logoutSuccess` and `logoutFailure` action and
   * will remove the authentication tokens. After a short delay the currently
   * opened dialogs will be closed and the `User` gets redirected to the `Login`
   * page.
   */
  logoutSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.logoutSuccess, AuthActions.logoutFailure),
      tap(() => this.authService.removeTokens()),
      delay(250),
      map(() => {
        this.authDialogService.closeAll();
        return AuthActions.loginRedirect();
      }),
    ),
  );

  /**
   * This effect listens to the `loginSuccess` action and will set the
   * authentication tokens from the payload of the action to the localstorage.
   * page.
   */
  setAuthTokens$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.loginSuccess),
        tap(({ tokens }) => this.authService.setTokens(tokens)),
      ),
    { dispatch: false },
  );

  constructor(
    private actions$: Actions,
    private store: Store<fromAuth.State>,
    private router: Router,
    private authService: AuthService,
    private authDialogService: AuthDialogService,
  ) {}
}
