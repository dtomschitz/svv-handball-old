import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Output,
} from '@angular/core';
import { Team, TeamInfo } from '@svv/core/models';
import { environment } from '@svv/website/environments/environment';
import { TeamsQuery, TeamsService } from '@svv/website/state/teams';
import { Observable, Subject } from 'rxjs';

@Component({
  selector: 'sidenav-left',
  templateUrl: './sidenav-left.component.html',
  styleUrls: ['./sidenav-left.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidenavLeftComponent {
  private readonly destroy$: Subject<void> = new Subject<void>();
  private readonly apiUrl = environment.apiUrl;

  loading$: Observable<boolean>;

  activeTeams$: Observable<TeamInfo[]>;
  maleYouthTeams$: Observable<TeamInfo[]>;
  femaleYouthTeams$: Observable<TeamInfo[]>;
  mixedYouthTeams$: Observable<TeamInfo[]>;

  @Output() navigate: EventEmitter<string> = new EventEmitter<string>();

  constructor(
    private teamsQuery: TeamsQuery,
  ) {
    this.loading$ = this.teamsQuery.selectLoading();

    this.activeTeams$ = this.teamsQuery.selectActiveTeams$;
    this.maleYouthTeams$ = this.teamsQuery.selectMaleYouthTeams$;
    this.femaleYouthTeams$ = this.teamsQuery.selectFemaleYouthTeams$;
    this.mixedYouthTeams$ = this.teamsQuery.selectMixedYouthTeams$;
  }

  navigateTo(routerLink: string) {
    this.navigate.emit(routerLink);
  }

  navigateToTeam(abbreviation: string) {
    this.navigate.emit(`/mannschaften/${abbreviation}`);
  }

  getTeamImagePath(teamId: string) {
    if (!teamId) {
      return undefined;
    }

    return `${this.apiUrl}/images/teams/${teamId}_icon.jpeg`;
  }

  trackByFn(index: number, team: Team) {
    return index;
  }

  emptyArray(length: number): any[] {
    return Array(length);
  }
}
