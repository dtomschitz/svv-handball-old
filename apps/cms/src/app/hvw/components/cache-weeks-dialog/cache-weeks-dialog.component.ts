import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'cache-weeks-dialog',
  templateUrl: './cache-weeks-dialog.component.html',
  styleUrls: ['./cache-weeks-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CacheWeeksDialog {
  constructor(private dialogRef: MatDialogRef<CacheWeeksDialog, boolean>) {}

  close(value: boolean) {
    this.dialogRef.close(value);
  }
}
