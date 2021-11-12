import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Team } from '@svv/core/models';

export interface SortTeamsDialogData {
  teams: Team[];
}

/**
 * This component is used as an dialog for sorting the `Teams`.
 */
@Component({
  selector: 'sort-teams-dialog',
  templateUrl: './sort-teams-dialog.component.html',
  styleUrls: ['./sort-teams-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SortTeamsDialog {
  teams: Team[];

  constructor(
    private dialogRef: MatDialogRef<SortTeamsDialog>,
    @Inject(MAT_DIALOG_DATA) public data: SortTeamsDialogData,
  ) {
    this.teams = [...data.teams];
  }

  /**
   * Updates the sorting of the `Teams`.
   *
   * @param event The drag and drop event.
   */
  drop(event: CdkDragDrop<Team[]>) {
    moveItemInArray(this.teams, event.previousIndex, event.currentIndex);
  }

  /**
   * Closes the dialog with the sorted `Teams` in order to initialize the
   * updating process.
   */
  save() {
    this.dialogRef.close(this.teams);
  }

  /**
   * Closes the dialog with the value `undefined` in order to stop the
   * updating process.
   */
  close() {
    this.dialogRef.close();
  }
}
