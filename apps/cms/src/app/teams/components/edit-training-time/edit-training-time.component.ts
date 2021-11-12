import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TrainingTime } from 'libs/models/src/team/training-time';

/**
 * This component is used as an dialog for modifying the `Coaches` of the given `Team`.
 */
@Component({
  selector: 'edit-training-time',
  templateUrl: './edit-training-time.component.html',
  styleUrls: ['./edit-training-time.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditTrainingTime implements OnInit {
  @Input() trainingTime: TrainingTime;
  @Output() trainingTimeChange = new EventEmitter<Partial<TrainingTime>>();

  editTrainingTimeForm: FormGroup;

  constructor(private formBuilder: FormBuilder) {
    this.editTrainingTimeForm = this.formBuilder.group({
      location: ['', Validators.required],
      startTime: ['', Validators.required],
      endTime: ['', Validators.required],
    });
  }

  ngOnInit() {
    const { location, startTime, endTime } = this.trainingTime;
    this.editTrainingTimeForm.setValue({
      location,
      startTime,
      endTime,
    });
  }

  update() {
    this.trainingTimeChange.emit(this.editTrainingTimeForm.value);
  }

  get invalidOrNotDirty() {
    return (
      this.editTrainingTimeForm.invalid || !this.editTrainingTimeForm.dirty
    );
  }
}
