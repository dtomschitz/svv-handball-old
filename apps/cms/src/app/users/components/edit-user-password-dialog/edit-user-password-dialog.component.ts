import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { User } from '@svv/core/models';

export interface EditUserPasswordDialogData {
  user: User;
}

/**
 * This component is used as an dialog for modifying the password of the given `User`.
 */
@Component({
  selector: 'edit-user-password-dialog',
  templateUrl: './edit-user-password-dialog.component.html',
  styleUrls: ['./edit-user-password-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditUserPasswordDialog {
  passwordControl: FormControl;
  hidePassword = true;

  constructor(
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<EditUserPasswordDialog>,
    @Inject(MAT_DIALOG_DATA) public data: EditUserPasswordDialogData,
  ) {
    this.passwordControl = this.formBuilder.control('', Validators.required);
  }

  /**
   * Closes the dialog without the changes.
   */
  close() {
    this.dialogRef.close(false);
  }

  get invalidOrNotDirty() {
    return this.passwordControl.invalid || !this.passwordControl.dirty;
  }
}
