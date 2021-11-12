import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Team } from '@svv/core/models';
import { TeamsQuery, TeamsService } from '@svv/website/state/teams';
import { RouterQuery } from '@datorama/akita-ng-router-store';
import { filter, mergeMap, takeUntil } from 'rxjs/operators';
import { SeoService } from '@svv/website/core/services';

@Component({
  selector: 'team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TeamComponent implements OnInit, OnDestroy {
  private readonly destroy$: Subject<void> = new Subject<void>();

  team$: Observable<Team>;
  loading$: Observable<boolean>;

  SWIPE_ACTION = { LEFT: 'swipeleft', RIGHT: 'swiperight' };
  selectedIndex: number = 0;

  constructor(
    private seoService: SeoService,
    private teamsService: TeamsService,
    private teamsQuery: TeamsQuery,
    private routerQuery: RouterQuery,
  ) {
    this.team$ = this.teamsQuery.selectCurrentTeam$;
    this.loading$ = this.teamsQuery.selectLoading();
  }

  ngOnInit() {
    this.routerQuery
      .selectParams('abbreviation')
      .pipe(
        mergeMap(abbreviation => this.teamsService.getTeam(abbreviation)),
        takeUntil(this.destroy$),
      )
      .subscribe();

    this.team$
      .pipe(
        filter(team => !!team),
        takeUntil(this.destroy$),
      )
      .subscribe(team => {
        this.seoService.setTitle(team.name);
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  showCoaches(team: Team) {
    return team?.coaches && team?.coaches.length !== 0;
  }

  showTrainingTimes(team: Team) {
    return team?.trainingTimes && team?.trainingTimes.length !== 0;
  }

  showContact(team: Team) {
    return team?.contact;
  }
}
