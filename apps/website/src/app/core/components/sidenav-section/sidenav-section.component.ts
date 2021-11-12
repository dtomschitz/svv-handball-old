import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'sidenav-section',
  templateUrl: './sidenav-section.component.html',
  styleUrls: ['./sidenav-section.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidenavSectionComponent {
  @Input() heading: string;
}
