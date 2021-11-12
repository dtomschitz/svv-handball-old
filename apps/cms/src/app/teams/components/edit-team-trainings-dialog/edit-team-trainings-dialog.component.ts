import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Team } from '@svv/core/models';
import { TrainingTime } from 'libs/models/src/team/training-time';

export interface EditTeamTrainingsDialogData {
  team: Team;
}

/**
 * This component is used as an dialog for modifying the `Coaches` of the given `Team`.
 */
@Component({
  selector: 'edit-team-trainings-dialog',
  templateUrl: './edit-team-trainings-dialog.component.html',
  styleUrls: ['./edit-team-trainings-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditTeamTrainingsDialog {
  createTrainingTimeForm: FormGroup;

  trainingTimes: TrainingTime[];

  constructor(
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<EditTeamTrainingsDialog, TrainingTime[]>,
    @Inject(MAT_DIALOG_DATA) private data: EditTeamTrainingsDialogData,
  ) {
    this.createTrainingTimeForm = this.formBuilder.group({
      location: ['', Validators.required],
      startTime: ['', Validators.required],
      endTime: ['', Validators.required],
    });

    this.trainingTimes = [...this.data.team?.trainingTimes] ?? [];
  }

  /**
   * Adds the given `^` to the selected list.
   *
   * @param coach The `Coach` which should get added to the Team.
   */
  addTrainingTime() {
    const { location, startTime, endTime } = this.createTrainingTimeForm.value;
    const trainingTime: TrainingTime = {
      location,
      startTime,
      endTime,
      position: this.trainingTimes.length + 1,
    };

    this.trainingTimes = [...this.trainingTimes, trainingTime];

    this.createTrainingTimeForm.reset('');
    this.createTrainingTimeForm.setErrors(null);
    /*for (let control in this.createTrainingTimeForm.controls) {
      this.createTrainingTimeForm.controls[control].setErrors(null);
    }*/
  }

  updateTrainingTime(index: number, update: Partial<TrainingTime>) {
    const updatedTrainingTime: TrainingTime = {
      location: update.location,
      startTime: update.startTime,
      endTime: update.endTime,
      position: this.trainingTimes[index].position,
    };

    this.trainingTimes[index] = updatedTrainingTime;
  }

  /**
   * Removes the `Training Time` which is associated with the given index
   * from the list.
   *
   * @param index The index of the `Training Time` which should get removed.
   */
  removeTrainingTime(index: number) {
    this.trainingTimes.splice(index, 1);
  }

  /**
   * Updates the sorting of the `Training Times`.
   *
   * @param event The drag and drop event.
   */
  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(
      this.trainingTimes,
      event.previousIndex,
      event.currentIndex,
    );
  }

  /**
   * Closes the dialog with the va in order to start the updating process.
   */
  save() {
    this.dialogRef.close(this.trainingTimes);
  }

  /**
   * Closes the dialog with the value `undefined` in order to stop the
   * updating process.
   */
  close() {
    this.dialogRef.close();
  }

  get team() {
    return this.data.team;
  }
}
