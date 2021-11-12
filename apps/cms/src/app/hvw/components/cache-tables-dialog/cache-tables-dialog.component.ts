import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'cache-tables-dialog',
  templateUrl: './cache-tables-dialog.component.html',
  styleUrls: ['./cache-tables-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CacheTablesDialog {
  constructor(private dialogRef: MatDialogRef<CacheTablesDialog, boolean>) {}

  close(value: boolean) {
    this.dialogRef.close(value);
  }
}
