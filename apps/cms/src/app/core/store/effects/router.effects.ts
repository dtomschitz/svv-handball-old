import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { tap } from 'rxjs/operators';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { RouterActions } from '@svv/cms/core/store/actions';

@Injectable()
export class RouterEffects {
  /**
   * This effect listens to the `navigate` action and will try to navigate the
   * `User` to the given URL.
   */
  navigate$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(RouterActions.navigate),
        tap(({ path, queryParams, extras }) => {
          const currentPath = path.join('/');
          if (currentPath !== 'verify' && currentPath !== 'login') {
            localStorage.setItem('route', currentPath);
          }
          this.router.navigate(path, { queryParams, ...extras });
        }),
      ),
    { dispatch: false },
  );

  /**
   * This effect listens to the `navigate` action and will try to navigate the
   * `User` back in the platforms history.
   */
  back$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(RouterActions.back),
        tap(() => this.location.back()),
      ),
    { dispatch: false },
  );

  /**
   * This effect listens to the `navigate` action and will try to navigate the
   * `User` forward in the platforms history.
   */
  forward$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(RouterActions.forward),
        tap(() => this.location.forward()),
      ),
    { dispatch: false },
  );

  constructor(
    private actions$: Actions,
    private router: Router,
    private location: Location,
  ) {}
}
