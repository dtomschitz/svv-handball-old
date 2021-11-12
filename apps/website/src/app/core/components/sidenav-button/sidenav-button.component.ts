import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
} from '@angular/core';

@Component({
  selector: 'sidenav-button',
  templateUrl: './sidenav-button.component.html',
  styleUrls: ['./sidenav-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidenavButtonComponent {
  @Input() loading: boolean = false;
  @Input() routerLink: string | any[];
  @Output() navigate: EventEmitter<void> = new EventEmitter<void>();
}
