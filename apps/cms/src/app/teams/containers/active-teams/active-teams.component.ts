import { ChangeDetectionStrategy, Component } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Team, TeamType } from '@svv/core/models';
import * as fromTeams from '@svv/cms/teams/store/reducers';

/**
 * This component is used to display the data table for all `active Teams`.
 */
@Component({
  selector: 'active-teams',
  templateUrl: './active-teams.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActiveTeamsComponent {
  teams$: Observable<Team[]>;
  defaultTeamType = TeamType.ACTIVE;

  constructor(private store: Store<fromTeams.State>) {
    this.teams$ = this.store.pipe(select(fromTeams.selectActiveTeams));
  }
}
