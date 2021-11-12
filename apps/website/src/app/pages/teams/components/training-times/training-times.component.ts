import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { TrainingTime } from 'libs/models/src/team/training-time';

@Component({
  selector: 'training-times',
  templateUrl: './training-times.component.html',
  styleUrls: ['./training-times.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TrainingTimesComponent {
  @Input() trainingTimes: TrainingTime[];
}
