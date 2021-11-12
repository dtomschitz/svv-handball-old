import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Output,
} from '@angular/core';

@Component({
  selector: 'sidenav-right',
  templateUrl: './sidenav-right.component.html',
  styleUrls: ['./sidenav-right.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidenavRightComponent {
  @Output() navigate: EventEmitter<string> = new EventEmitter<string>();
}
