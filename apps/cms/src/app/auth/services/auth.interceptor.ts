import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
} from '@angular/common/http';
import { defer, Observable, throwError } from 'rxjs';
import {
  concatMap,
  first,
  map,
  mergeMap,
  retryWhen,
  take,
} from 'rxjs/operators';
import { select, Store } from '@ngrx/store';
import { Actions, ofType } from '@ngrx/effects';
import { AuthActions } from '@svv/cms/auth/store/actions';
import * as fromAuth from '@svv/cms/auth/store/reducers';

/**
 * This interceptor is used to add the currently stored access token of the
 * `User` to the request body. This is required in order to access most of the
 * endpoints of the API.
 */
@Injectable({
  providedIn: 'root',
})
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private store: Store<fromAuth.State>,
    private actions$: Actions,
  ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<any> {
    // If the reuests route is either the refresh or verify route, the request
    // will be automatically let through without further modification.
    if (request.url.includes('refresh') || request.url.includes('verify')) {
      return next.handle(request);
    }

    return this.store.pipe(
      select(fromAuth.selectAccessToken),
      first(),
      // Adds the access token to the request.
      map(accessToken => {
        return this.addToken(request, accessToken);
      }),
      concatMap(authRequest => next.handle(authRequest)),
      // If the authentication with the given access token has been failed,
      // a retry will be started which will try to refresh the acces token with
      // the stored refresh token of the `User`. In case the second attempt
      // failed again the `User` will be logged out and navigated to
      // the `Login` page.
      retryWhen(errors =>
        errors.pipe(
          mergeMap((error, index) => {
            if (error.status !== 401) {
              return throwError(error);
            }

            if (index === 0) {
              return defer(() => {
                this.store.dispatch(AuthActions.refreshAccessToken());
                return this.actions$.pipe(
                  ofType(
                    AuthActions.refreshAccessTokenSuccess,
                    AuthActions.refreshAccessTokenFailure,
                  ),
                );
              });
            }

            this.store.dispatch(AuthActions.logout());
            return throwError(error);
          }),
          take(2),
        ),
      ),
    );
  }

  /**
   * Adds the access token to the HTTP request.
   */
  private addToken(request: HttpRequest<any>, token: string) {
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
}
