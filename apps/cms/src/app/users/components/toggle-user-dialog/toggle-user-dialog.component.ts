import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { select, Store } from '@ngrx/store';
import { User } from '@svv/core/models';
import { CustomValidators } from '@svv/cms/shared/validators';
import * as fromUsers from '@svv/cms/users/store/reducers';

export interface ToggleUserDialogData {
  user: User;
}

/**
 * This component is used as an dialog for enabling or disabling the given `User`.
 */
@Component({
  selector: 'toggle-user-dialog',
  templateUrl: './toggle-user-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToggleUserDialog {
  userForm: FormGroup;
  hidePassword = true;

  constructor(
    private store: Store<fromUsers.State>,
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<ToggleUserDialog, Partial<User>>,
    @Inject(MAT_DIALOG_DATA) private data: ToggleUserDialogData,
  ) {
    this.userForm = this.formBuilder.group({});

    if (!this.data.user.email) {
      this.userForm.addControl(
        'email',
        this.formBuilder.control(
          '',
          [Validators.required, Validators.email],
          CustomValidators.duplicateValueValidator(
            this.store.pipe(select(fromUsers.selectAllUserEmails)),
            this.data?.user?.email,
          ),
        ),
      );
    }

    if (!this.data.user.password) {
      this.userForm.addControl(
        'password',
        this.formBuilder.control('', Validators.required),
      );
    }
  }

  /**
   * Enables or disables the authentication for the given `User`.
   *
   * @param user The given `User` from the dialog data.
   */
  toggleUser(user: User) {
    const changes: Partial<User> = {
      canLogin: !user.canLogin,
    };

    if (!this.user.email && this.userForm.get('email').valid) {
      changes.email = this.userForm.get('email').value;
    }

    if (!this.user.password && this.userForm.get('password').valid) {
      changes.password = this.userForm.get('password').value;
    }

    this.dialogRef.close(changes);
  }

  /**
   * Closes the dialog without the changes.
   */
  close() {
    this.dialogRef.close();
  }

  get invalidOrNotDirty() {
    return this.userForm.invalid || !this.userForm.dirty;
  }

  get user() {
    return this.data.user;
  }

  get canLogin() {
    return this.user.canLogin;
  }

  get hasEmailOrPassword() {
    return this.hasEmail && this.hasPassword;
  }

  get hasEmail() {
    return this.user.email;
  }

  get hasPassword() {
    return this.user.password;
  }
}
