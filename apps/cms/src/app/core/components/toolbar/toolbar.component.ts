import {
  Component,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  Input,
} from '@angular/core';

/**
 * Component is used as the app header.
 */
@Component({
  selector: 'toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToolbarComponent {
  @Input() loggedIn: boolean;
  @Output() toggleSidenav: EventEmitter<void> = new EventEmitter<void>();
}
