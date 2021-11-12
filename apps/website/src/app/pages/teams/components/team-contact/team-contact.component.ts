import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'team-contact',
  templateUrl: './team-contact.component.html',
  styleUrls: ['./team-contact.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TeamContactComponent {
  @Input() contact: string;

  get href() {
    return `mailto:${this.contact}`;
  }
}
