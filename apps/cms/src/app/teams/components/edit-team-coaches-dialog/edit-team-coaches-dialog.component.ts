import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { TeamCoach, Team } from '@svv/core/models';

export interface EditTeamCoachesDialogData {
  team: Team;
  coaches: TeamCoach[];
}

/**
 * This component is used as an dialog for modifying the `Coaches` of the given `Team`.
 */
@Component({
  selector: 'edit-team-coaches-dialog',
  templateUrl: './edit-team-coaches-dialog.component.html',
  styleUrls: ['./edit-team-coaches-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditTeamCoachesDialog {
  searchControl: FormControl;

  selectedCoaches: TeamCoach[] = [];
  filteredCoaches$: Observable<TeamCoach[]>;

  constructor(
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<EditTeamCoachesDialog, string[]>,
    @Inject(MAT_DIALOG_DATA) private data: EditTeamCoachesDialogData,
  ) {
    this.searchControl = this.formBuilder.control('');

    this.filteredCoaches$ = this.searchControl.valueChanges.pipe(
      startWith(''),
      map((value: string) => {
        const filteredCoaches = this.data.coaches.filter(
          coach => !this.selectedCoaches.includes(coach),
        );

        if (!value) {
          return filteredCoaches.slice();
        }

        return filteredCoaches.filter(coach =>
          `${coach.firstName} ${coach.lastName}`
            .toLowerCase()
            .includes(value.toLowerCase()),
        );
      }),
    );

    this.selectedCoaches = this.data.team.coachIds.reduce<TeamCoach[]>(
      (list, id) => {
        const coach = this.data.coaches.find(c => c._id === id);
        if (coach) {
          list.push(coach);
        }

        return list;
      },
      [],
    );
  }

  /**
   * Adds the given `Coach` to the selected list.
   * @param coach The `Coach` which should get added to the Team.
   */
  addCoach(coach: TeamCoach) {
    this.selectedCoaches.push(coach);
    this.resetSearchControl();
  }

  /**
   * Removes the `Coach` which is associated with the given id from thelist.
   * @param id The id of the`Coach` which should removed.
   */
  removeCoach(id: string) {
    this.selectedCoaches = this.selectedCoaches.filter(
      coach => coach._id !== id,
    );
  }

  /**
   * Updates the sorting of the selected `Coaches`.
   *
   * @param event The drag and drop event.
   */
  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(
      this.selectedCoaches,
      event.previousIndex,
      event.currentIndex,
    );
  }

  /**
   * Closes the dialog with the va in order to start the updating process.
   */
  save() {
    this.dialogRef.close(this.selectedCoaches.map(coach => coach._id));
  }

  /**
   * Closes the dialog with the value `undefined` in order to stop the
   * updating process.
   */
  close() {
    this.dialogRef.close();
  }

  /**
   * Resets the search control.
   */
  resetSearchControl() {
    this.searchControl.setValue('');
  }
}
