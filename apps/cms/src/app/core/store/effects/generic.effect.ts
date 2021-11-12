import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Action, ActionCreator, Creator } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import {
  catchError,
  concatMap,
  delay,
  filter,
  map,
  switchMap,
  withLatestFrom,
} from 'rxjs/operators';
import { HotToastService } from '@ngneat/hot-toast';
import { Notification, NotificationType, WithOptional } from '@svv/core/models';
import { UnpackAction } from '@svv/cms/shared/utils';
import { NotificationActions } from '@svv/cms/core/store/actions';
import { getDefaultNotification } from '@svv/cms/core/notifications';

type On<A, T> = (action: UnpackAction<A>) => OnCallbacks<T>;

interface OnCallbacks<T> {
  success: (response: T) => Action;
  failure: (response: any) => Action;
  cache?: () => Action;
}

interface HotToastConfig {
  service: HotToastService;
  initial?: string | Action;
  success?: string | Action;
  error?: string | Action;
}

const getService = (configOrService: HotToastService | HotToastConfig) => {
  return 'service' in configOrService
    ? configOrService.service
    : configOrService;
};

const getMessage = (keyOrAction: string | Action) => {
  if (typeof keyOrAction === 'string') {
    return keyOrAction;
  }

  const notifiction = getDefaultNotification(keyOrAction.type);
  return typeof notifiction === 'string'
    ? notifiction
    : notifiction?.message
    ? notifiction.message
    : '';
};

/**
 * Creates a generic effect which enables to create http request to an endpoint
 * and dispatch actions according to the response. Additionaly it is also
 * possible to verify if the data has been already chached inside the
 * respective state by using the given selector.
 *
 * In order to notify the `User` about ongoing processes and the current state
 * of those, notifications can be configured. Those messages can be either
 * definied iniside the config or get obtained through the respective action.
 * If the message should get selected via the given `Action` it has to be set
 * in the global notifications list.
 * 
 * ```ts
  createTeam$ = createGenericEffect(
    this.actions$,
    TeamActions.createTeam,
    action => this.teamsService.createTeam(action.team),
    () => ({
      success: team => TeamActions.createTeamSuccess({ team }),
      failure: () => TeamActions.createTeamFailure(),
    }),
  )(this.toastService);
 * ```
 *
 * @param actions$ The `Actions` pipe.
 * @param allowedType The type of `Action` the effect should listen to.
 * @param method The method which will be used to access the API endpoint.
 * @param on The callback methods which will be called on the according response.
 */
export const createGenericEffect = <
  T,
  AC extends ActionCreator<string, Creator>,
  A extends string | AC
>(
  actions$: Actions,
  allowedType: A,
  method: (action: UnpackAction<A>) => Observable<T>,
  on: On<A, T>,
  options?: {
    delay?: number;
    dispatch?: boolean;
    cachingSelector?: Observable<boolean>;
  },
) => {
  return (configOrService?: HotToastService | HotToastConfig) => {
    const withCaching = options?.cachingSelector !== undefined && 'cache' in on;
    const apiCall$ = (action: UnpackAction<A>) => {
      return !configOrService
        ? method(action).pipe(
            delay(options?.delay ?? 250),
            map(response => on(action).success(response)),
            catchError(response => of(on(action).failure(response))),
          )
        : method(action).pipe(
            delay(options?.delay ?? 250),
            getService(configOrService).observe({
              loading:
                'initial' in configOrService &&
                !(configOrService instanceof HotToastService)
                  ? getMessage(configOrService.initial)
                  : getMessage(allowedType),
              success:
                'success' in configOrService &&
                !(configOrService instanceof HotToastService)
                  ? getMessage(configOrService.initial)
                  : getMessage(on(action).success(undefined)),
              error:
                configOrService.error &&
                !(configOrService instanceof HotToastService)
                  ? getMessage(configOrService.error)
                  : getMessage(on(action).failure(undefined)),
            }),
            map(response => on(action).success(response)),
            catchError(response => of(on(action).failure(response))),
          );
    };

    return createEffect(
      () => {
        if (withCaching) {
          return actions$.pipe(
            ofType(allowedType),
            concatMap(action =>
              of(action).pipe(withLatestFrom(options?.cachingSelector)),
            ),
            switchMap(([action, cached]) => {
              return cached ? of(on(action).cache()) : apiCall$(action);
            }),
          );
        }

        return actions$.pipe(ofType(allowedType), switchMap(apiCall$));
      },
      { dispatch: options?.dispatch ?? true },
    );
  };
};
