import {
  HttpErrorResponse,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class HttpErrorInterceptor implements HttpInterceptor {
  constructor(private snackbar: MatSnackBar) {}

  intercept(request: HttpRequest<any>, next: HttpHandler) {
    return next.handle(request).pipe(
      catchError((response: HttpErrorResponse) => {
        if (response.url.includes('teams/minimal') && response.status === 0) {
          this.snackbar.open(
            'Es konnte keine Verbindung hergestellt werden',
            'Okay',
          );
        }

        return throwError(response);
      }),
    );
  }
}
