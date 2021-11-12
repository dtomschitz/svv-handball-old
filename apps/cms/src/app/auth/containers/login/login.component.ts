import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { select, Store } from '@ngrx/store';
import { Observable, pipe, Subject } from 'rxjs';
import { AuthActions } from '@svv/cms/auth/store/actions';
import * as fromAuth from '@svv/cms/auth/store/reducers';
import { filter, takeUntil } from 'rxjs/operators';
import { RouterActions } from '@svv/cms/core/store/actions';

/**
 * This component is usedto display the `Login` page where the `User` can
 * authenticate.
 */
@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginPageComponent implements OnInit, OnDestroy {
  private readonly destroy$: Subject<void> = new Subject<void>();
  pending$: Observable<boolean>;

  credentialsForm: FormGroup;
  hidePassword = true;

  constructor(
    private formBuilder: FormBuilder,
    private store: Store<fromAuth.State>,
  ) {
    this.pending$ = this.store.pipe(select(fromAuth.selectIsAuthPending));

    this.credentialsForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.store
      .pipe(
        select(fromAuth.selectIsLoggedIn),
        filter(loggedIn => loggedIn),
        takeUntil(this.destroy$),
      )
      .subscribe(() => {
        this.store.dispatch(
          RouterActions.navigate({
            path: [localStorage.getItem('route') ?? '/'],
          }),
        );
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Dispatches the action for loggin in the `User` with the entered credentials.
   */
  login() {
    this.store.dispatch(
      AuthActions.login({ credentials: this.credentialsForm.value }),
    );
  }

  get isInvalidOrNotDirty() {
    return this.credentialsForm.invalid || !this.credentialsForm.dirty;
  }
}
