import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Output,
} from '@angular/core';

@Component({
  selector: 'sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidenavComponent {
  @Output() navigate: EventEmitter<string> = new EventEmitter<string>();

  navigateTo(routerLink: string) {
    this.navigate.emit(routerLink);
  }

  navigateToTeam(abbreviation: string) {
    this.navigate.emit(`/mannschaften/${abbreviation}`);
  }
}
