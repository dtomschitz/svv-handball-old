import { Injectable } from '@angular/core';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { HotToastService } from '@ngneat/hot-toast';
import { map, tap } from 'rxjs/operators';
import { NotificationActions } from '@svv/cms/core/store/actions';

@Injectable()
export class NotificationEffects {
  /**
   * This effect listens to the `showSnackbar` action and will display the
   * given `Notification` to the `User`.
   */
  showSnackbar$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(NotificationActions.showSnackbar),
        map(action => action.notification),
        tap(({ type, message }) => {
          this.toastService[type](message);
        }),
      ),
    { dispatch: false },
  );

  constructor(
    private actions$: Actions,
    private toastService: HotToastService,
  ) {}
}
