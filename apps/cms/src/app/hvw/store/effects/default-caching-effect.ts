import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Action, ActionCreator, Creator } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import {
  catchError,
  concatMap,
  delay,
  map,
  switchMap,
  withLatestFrom,
} from 'rxjs/operators';
import { User } from '@svv/core/models';
import { UnpackAction } from '@svv/cms/shared/utils';

export const createDefaultCachingEffect = <
  T,
  AC extends ActionCreator<string, Creator>,
  A extends string | AC
>(
  actions$: Actions,
  allowedType: A,
  user$: Observable<User>,
  method: (action: UnpackAction<A>, user: User) => Observable<T>,
  on: (
    action: UnpackAction<A>,
  ) => {
    success: (response: T) => Action;
    failure: (response: T) => Action;
  },
  options?: {
    delay?: number;
  },
) => {
  return createEffect(() =>
    actions$.pipe(
      ofType(allowedType),
      concatMap(action => of(action).pipe(withLatestFrom(user$))),
      switchMap(([action, user]) =>
        method(action, user).pipe(
          delay(options?.delay ?? 0),
          map(response => on(action).success(response)),
          catchError(response => of(on(action).failure(response))),
        ),
      ),
    ),
  );
};
