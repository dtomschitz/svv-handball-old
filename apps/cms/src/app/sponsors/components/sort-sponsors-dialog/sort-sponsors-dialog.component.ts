import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Sponsor } from '@svv/core/models';

export interface SortSponsorsDialogData {
  sponsors: Sponsor[];
}

/**
 * This component is used as an dialog for sorting the `Sponsors`.
 */
@Component({
  selector: 'sort-sponsors-dialog',
  templateUrl: './sort-sponsors-dialog.component.html',
  styleUrls: ['./sort-sponsors-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SortSponsorsDialog {
  sponsors: Sponsor[];

  constructor(
    private dialogRef: MatDialogRef<SortSponsorsDialog>,
    @Inject(MAT_DIALOG_DATA) public data: SortSponsorsDialogData,
  ) {
    this.sponsors = [...data.sponsors];
  }

  /**
   * Updates the sorting of the `Sponsors`.
   *
   * @param event The drag and drop event.
   */
  drop(event: CdkDragDrop<Sponsor[]>) {
    moveItemInArray(this.sponsors, event.previousIndex, event.currentIndex);
  }

  /**
   * Closes the dialog with the sorted `Sponsors` in order to initialize the
   * updating process.
   */
  save() {
    this.dialogRef.close(this.sponsors);
  }

  /**
   * Closes the dialog with the value `undefined` in order to stop the
   * updating process.
   */
  close() {
    this.dialogRef.close();
  }
}
