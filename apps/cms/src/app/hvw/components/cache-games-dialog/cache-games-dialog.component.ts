import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'cache-games-dialog',
  templateUrl: './cache-games-dialog.component.html',
  styleUrls: ['./cache-games-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CacheGamesDialog {
  constructor(private dialogRef: MatDialogRef<CacheGamesDialog, boolean>) {}

  close(value: boolean) {
    this.dialogRef.close(value);
  }
}
