import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { GameWeek, HvwWeek } from '@svv/core/models';
import { GamesQuery, GamesService } from '@svv/website/state/games';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'encounters-control',
  templateUrl: './encounters-control.component.html',
  styleUrls: ['./encounters-control.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EncountersControlComponent implements OnInit, OnDestroy {
  private readonly destroy$: Subject<void> = new Subject<void>();

  gameWeek$: Observable<GameWeek>;
  weeks$: Observable<HvwWeek[]>;

  constructor(
    private gamesQuery: GamesQuery,
    private gamesService: GamesService,
  ) {
    this.gameWeek$ = this.gamesQuery.selectCurrentGameWeek();
    this.weeks$ = this.gamesQuery.selectWeeks();
  }

  ngOnInit() {
    this.loadWeek();
    this.loadWeeks();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadWeek(week?: string, refresh?: boolean) {
    this.gamesService
      .getGameWeek(week, refresh)
      .pipe(takeUntil(this.destroy$))
      .subscribe();
  }

  loadWeeks() {
    this.gamesService.getWeeks().pipe(takeUntil(this.destroy$)).subscribe();
  }
}
