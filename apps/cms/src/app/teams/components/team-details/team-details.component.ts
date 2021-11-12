import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
} from '@angular/core';
import { select, Store } from '@ngrx/store';
import { TeamCoach, HvwClass, Team } from '@svv/core/models';
import { environment } from '@svv/cms/environments/environment';
import * as fromUsers from '@svv/cms/users/store/reducers';
import * as fromHvw from '@svv/cms/hvw/store/reducers';

/**
 * This component is used for displaying informations about the currently selected `Team`
 * inside the `Teams` data table.
 */
@Component({
  selector: 'team-details',
  templateUrl: './team-details.component.html',
  styleUrls: ['./team-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TeamDetailsComponent implements OnChanges {
  private apiUrl = environment.apiUrl;

  /**
   * The currently selected `Team`
   */
  @Input() team: Team;

  /**
   * Gets emitted if the edit button has been pressed.
   */
  @Output() editTeamImage: EventEmitter<void> = new EventEmitter<void>();

  /**
   * Gets emitted if the toggle button has been pressed.
   */
  @Output() toggleTeamImage: EventEmitter<void> = new EventEmitter<void>();

  /**
   * Gets emitted if the delete button has been pressed.
   */
  @Output() deleteTeamImage: EventEmitter<void> = new EventEmitter<void>();

  coaches: TeamCoach[];
  class: HvwClass;

  constructor(private store: Store<fromHvw.State & fromUsers.State>) {}

  ngOnChanges() {
    this.store
      .pipe(select(fromUsers.selectCoachesByIds, this.team.coachIds))
      .subscribe(coaches => {
        this.coaches = coaches;
      });

    this.store
      .pipe(select(fromHvw.selectClassById, this.team.classId))
      .subscribe(clazz => {
        this.class = clazz;
      });
  }

  /**
   * @returns A list of all `Coach` names.
   */
  get coachesNames() {
    return this.coaches.map(
      ({ firstName, lastName }) => `${firstName} ${lastName}`,
    );
  }

  /**
   * @returns The default image path.
   */
  get imagePath() {
    return `${this.apiUrl}/${this.team.images.small.path}`;
  }
}
