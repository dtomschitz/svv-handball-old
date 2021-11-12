import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { select, Store } from '@ngrx/store';
import { User } from '@svv/core/models';
import { CustomValidators } from '@svv/cms/shared/validators';
import { DialogMode } from '@svv/cms/core/models';
import * as fromUsers from '@svv/cms/users/store/reducers';

export interface CreateOrEditUserDialogData {
  mode: DialogMode;
  user?: User;
  canLogin?: boolean;
  disableCanLoginControl?: boolean;
}

/**
 * This component is used as an dialog for creating or modifying a `User`.
 */
@Component({
  selector: 'create-user-dialog',
  templateUrl: './create-or-edit-user-dialog.component.html',
  styleUrls: ['./create-or-edit-user-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateOrEditUserDialog {
  userForm: FormGroup;
  hidePassword = true;
  canLogin: boolean;

  constructor(
    private store: Store<fromUsers.State>,
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<CreateOrEditUserDialog>,
    @Inject(MAT_DIALOG_DATA) public data: CreateOrEditUserDialogData,
  ) {
    this.canLogin = this.data.canLogin;
    this.userForm = this.formBuilder.group({
      firstName: [data?.user?.firstName, Validators.required],
      lastName: [data?.user?.lastName, Validators.required],
    });

    if (this.canLogin) {
      this.addCredentialsControls();
    }
  }

  /**
   * Adds or removes the credential from controls.
   */
  toggleCanLogin() {
    this.canLogin = !this.canLogin;

    if (this.canLogin) {
      this.addCredentialsControls();
    } else {
      this.removeCredentialsControls();
    }
  }

  /**
   * Closes the dialog without the changes.
   */
  close() {
    this.dialogRef.close();
  }

  /**
   * Adds the credential form controls to the `User` form.
   */
  private addCredentialsControls() {
    this.userForm.addControl(
      'email',
      this.formBuilder.control(
        this.data?.user?.email,
        [Validators.required, Validators.email],
        CustomValidators.duplicateValueValidator(
          this.store.pipe(select(fromUsers.selectAllUserEmails)),
          this.data?.user?.email,
        ),
      ),
    );

    if (this.isCreateDialog) {
      this.userForm.addControl(
        'password',
        this.formBuilder.control('', Validators.required),
      );
    }
  }

  /**
   * Removes the credential form controls from the `User` form.
   */
  private removeCredentialsControls() {
    this.userForm.removeControl('email');
    this.userForm.removeControl('password');
  }

  get invalidOrNotDirty() {
    return this.userForm.invalid || !this.userForm.dirty;
  }

  get isCreateDialog() {
    return this.data.mode === DialogMode.CREATE;
  }
}
