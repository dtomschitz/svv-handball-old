import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Team } from '@svv/core/models';

@Component({
  selector: 'team-header',
  templateUrl: './team-header.component.html',
  styleUrls: ['./team-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TeamHeaderComponent {
  @Input() team: Team;
  @Input() loading: boolean;
}
