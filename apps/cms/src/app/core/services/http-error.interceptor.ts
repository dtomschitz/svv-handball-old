import {
  HttpErrorResponse,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ErrorType, getErrorMessage, NotificationType } from '@svv/core/models';
import { NotificationActions } from '@svv/cms/core/store/actions';
import * as fromRoot from '@svv/cms/reducers';

const ignoredErrors = [
  ErrorType.USERS_NOT_FOUND,
  ErrorType.CONTACT_PERSONS_NOT_FOUND,
  ErrorType.ARTICLES_NOT_FOUND,
  ErrorType.CATEGORIES_NOT_FOUND,
  ErrorType.TEAMS_NOT_FOUND,
  ErrorType.SPONSORS_NOT_FOUND,
  ErrorType.JOBS_NOT_FOUND,
];

/**
 * This interceptor is used to notify the `User` if an error occured while a
 * request was processed by the backend. If the error is known,
 * the `showSnackbar` action will be dispatched in order to display a
 * `Notification` to the `User`.
 */
@Injectable({
  providedIn: 'root',
})
export class HttpErrorInterceptor implements HttpInterceptor {
  constructor(private store: Store<fromRoot.State>) {}

  intercept(request: HttpRequest<any>, next: HttpHandler) {
    return next.handle(request).pipe(
      catchError((response: HttpErrorResponse) => {
        if (response.error && ignoredErrors.includes(response.error)) {
          const message = getErrorMessage(response.error.type);
          if (message) {
            this.store.dispatch(
              NotificationActions.showSnackbar({
                notification: {
                  type: NotificationType.ERROR,
                  message,
                },
              }),
            );
          }
        }

        if (response.url.includes('auth') && response.status === 0) {
          this.store.dispatch(
            NotificationActions.showSnackbar({
              notification: {
                type: NotificationType.ERROR,
                message: 'Verbindung zur API nicht möglich!',
              },
            }),
          );
        }

        return throwError(response);
      }),
    );
  }
}
