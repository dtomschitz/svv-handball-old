import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CalloutType } from '@svv/common-components/callout';

export interface ConfirmationDialogData {
  title: string;
  callout: {
    type: keyof typeof CalloutType;
    message: string;
  };
  item?: {
    name: string;
    line: string;
  };
  buttons: {
    confirm: {
      title: string;
      color: 'primary' | 'warn';
    };
    cancel: string;
  };
}

/**
 * This component serves to inform the user about the consequences of his
 * actions. The content of the component will be easily projected into by the
 * <ng-content> component.
 */
@Component({
  selector: 'confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmationDialog {
  constructor(
    private dialogRef: MatDialogRef<ConfirmationDialog>,
    @Inject(MAT_DIALOG_DATA) private data: ConfirmationDialogData,
  ) {}

  /**
   * Closes the dialog with the value `true`.
   */
  confirm() {
    this.dialogRef.close(true);
  }

  /**
   * Closes the dialog with the value `false`.
   */
  cancel() {
    this.dialogRef.close(false);
  }

  get title() {
    return this.data.title;
  }

  get calloutConfig() {
    return this.data.callout;
  }

  get item() {
    return this.data.item;
  }

  get buttons() {
    return this.data.buttons;
  }
}
