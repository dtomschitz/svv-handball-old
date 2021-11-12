import { ChangeDetectionStrategy, Component } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Team, TeamType } from '@svv/core/models';
import * as fromTeams from '@svv/cms/teams/store/reducers';

/**
 * This component is used to display the data table for all `youth Teams`.
 */
@Component({
  selector: 'youth-teams',
  templateUrl: './youth-teams.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class YouthTeamsComponent {
  teams$: Observable<Team[]>;
  defaultTeamType = TeamType.YOUTH;

  constructor(private store: Store<fromTeams.State>) {
    this.teams$ = this.store.pipe(select(fromTeams.selectYouthTeams));
  }
}
