import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { concatMap, map, take, withLatestFrom } from 'rxjs/operators';
import { AuthActions } from '@svv/cms/auth/store/actions';
import * as fromAuth from '@svv/cms/auth/store/reducers';
import { of } from 'rxjs';

/**
 * Authentication guard which is used to protect all routes of the application
 * from unauthorized accessed. This is achieved by validating if the `User`
 * is logged in or not. If the verification failed the `User` will be
 * automatically navigated towards the `Login` page.
 */
@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private store: Store<fromAuth.State>) {}

  canActivate() {
    return this.store.pipe(
      select(fromAuth.selectIsVerifying),
      concatMap(verifying =>
        of(verifying).pipe(
          withLatestFrom(this.store.pipe(select(fromAuth.selectIsLoggedIn))),
        ),
      ),
      map(([verifying, loggedIn]) => {
        if (verifying) {
          this.store.dispatch(AuthActions.verifyRedirect());
          return false;
        }

        if (!loggedIn) {
          this.store.dispatch(AuthActions.loginRedirect());
          return false;
        }

        return true;
      }),
      take(1),
    );
  }
}
