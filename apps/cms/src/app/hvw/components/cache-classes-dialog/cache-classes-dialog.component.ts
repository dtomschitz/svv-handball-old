import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'cache-classes-dialog',
  templateUrl: './cache-classes-dialog.component.html',
  styleUrls: ['./cache-classes-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CacheClassesDialog {
  constructor(private dialogRef: MatDialogRef<CacheClassesDialog, boolean>) {}

  close(value: boolean) {
    this.dialogRef.close(value);
  }
}
