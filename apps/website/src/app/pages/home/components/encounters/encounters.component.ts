import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Observable } from 'rxjs';
import { GameWeek, ErrorResponse, GamesFilterType } from '@svv/core/models';
import { GamesQuery } from '@svv/website/state/games';

@Component({
  selector: 'encounters',
  templateUrl: './encounters.component.html',
  styleUrls: ['./encounters.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EncountersComponent {
  gameWeek$: Observable<GameWeek>;
  loading$: Observable<boolean>;
  error$: Observable<ErrorResponse>;

  filterType: GamesFilterType;

  constructor(private gamesQuery: GamesQuery) {
    this.gameWeek$ = this.gamesQuery.selectCurrentGameWeek();
    this.loading$ = this.gamesQuery.selectLoading();
    this.error$ = this.gamesQuery.selectError();
  }

  onFilterChanged(type: GamesFilterType) {
    this.filterType = type;
  }

  isValidDate(date: string) {
    return date !== 'Invalid Date';
  }

  emptyArray(start: number, end: number): any[] {
    return Array(Math.floor(Math.random() * end) + start);
  }
}
