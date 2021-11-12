import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  OnDestroy,
  SimpleChanges,
} from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ErrorResponse, HvwGame, HvwSchedule, Team } from '@svv/core/models';
import { SchedulesQuery, SchedulesService } from '@svv/website/state/schedules';

@Component({
  selector: 'hvw-schedule',
  templateUrl: './hvw-schedule.component.html',
  styleUrls: ['./hvw-schedule.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HVWScheduleComponent implements OnChanges, OnDestroy {
  private readonly destroy$: Subject<void> = new Subject<void>();

  @Input() team: Team;
  @Input() classId: string;

  schedule$: Observable<HvwSchedule>;
  loading$: Observable<boolean>;
  error$: Observable<ErrorResponse>;

  constructor(
    private schedulesQuery: SchedulesQuery,
    private schedulesService: SchedulesService,
  ) {
    this.schedule$ = this.schedulesQuery.selectActive();
    this.loading$ = this.schedulesQuery.selectLoading();
    this.error$ = this.schedulesQuery.selectError();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.classId && changes.classId.currentValue) {
      this.schedulesService
        .getSchedule(this.classId)
        .pipe(takeUntil(this.destroy$))
        .subscribe();
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  openGymOrGameReport(game: HvwGame) {
    if (this.hasReport(game)) {
      window.open(
        `http://spo.handball4all.de/misc/sboPublicReports.php?sGID=${game.sGId}`,
      );
      return;
    }
  }

  isHomeTeam(name: string): boolean {
    return name.includes('SV Vaihingen');
  }

  hasReport(game: HvwGame) {
    return game.sGId !== 0;
  }

  isGamePostponed(game: HvwGame) {
    return game.comment === 'abgesetzt' || game.comment === 'abgesagt';
  }

  getScoreClass(game: HvwGame) {
    if (game.teams.home.goals === game.teams.guest.goals) {
      return 'tie';
    }

    if (game.teams.home.name.includes('SV Vaihingen')) {
      return game.teams.home.goals > game.teams.guest.goals ? 'win' : 'lost';
    } else if (game.teams.guest.name.includes('SV Vaihingen')) {
      return game.teams.home.goals < game.teams.guest.goals ? 'win' : 'lost';
    }
  }

  emptyArray(n: number): any[] {
    return Array(n);
  }

  trackByFn(index: number, game: HvwGame) {
    return game._id;
  }
}
