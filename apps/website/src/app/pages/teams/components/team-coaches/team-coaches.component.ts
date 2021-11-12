import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { TeamCoach } from '@svv/core/models';

@Component({
  selector: 'team-coaches',
  templateUrl: './team-coaches.component.html',
  styleUrls: ['./team-coaches.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TeamCoachesComponent {
  @Input() coaches: TeamCoach[];

  get transformedCoaches() {
    return this.coaches.map(
      ({ firstName, lastName }) => `${firstName} ${lastName}`,
    );
  }
}
