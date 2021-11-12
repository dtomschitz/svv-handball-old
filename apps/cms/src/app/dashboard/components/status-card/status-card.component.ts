import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { Service, ServiceStatus } from '@svv/core/models';

@Component({
  selector: 'status-card',
  templateUrl: './status-card.component.html',
  styleUrls: ['./status-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatusCardComponent {
  @Input() services: Service[];
  @Output() refreshStatus: EventEmitter<void> = new EventEmitter<void>();

  isDown(status: ServiceStatus) {
    return status === ServiceStatus.DOWN;
  }
}
