import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { HvwCachingResult, HvwGame, NotificationType } from '@svv/core/models';
import { NotificationActions } from '@svv/cms/core/store/actions';
import { GamesActions } from '@svv/cms/hvw/store/actions';
import { HvwDialogService } from '@svv/cms/hvw/services';
import * as fromHvw from '@svv/cms/hvw/store/reducers';
import * as dayjs from 'dayjs';

/**
 * This component is used to display the `Games` data table.
 */
@Component({
  selector: 'games',
  templateUrl: './games.component.html',
  styleUrls: ['./games.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GamesComponent implements OnInit, OnDestroy {
  private readonly destroy$: Subject<void> = new Subject<void>();

  games$: Observable<HvwGame[]>;
  cachingResults$: Observable<HvwCachingResult[]>;
  cachingResultsLoading$: Observable<boolean>;
  loading$: Observable<boolean>;

  /**
   * The columns which are displayed in the data table.
   */
  displayedColumns = [
    'id',
    'class',
    'date',
    'time',
    'teams',
    'comment',
    '_id',
    'actions',
  ];

  constructor(
    private store: Store<fromHvw.State>,
    private hvwDialogService: HvwDialogService,
  ) {
    this.games$ = this.store.pipe(select(fromHvw.selectAllGames));
    this.cachingResults$ = this.store.pipe(
      select(fromHvw.selectGamesCachingResults),
    );
    this.cachingResultsLoading$ = this.store.pipe(
      select(fromHvw.selectGamesCachingResultsLoading),
    );
    this.loading$ = this.store.pipe(select(fromHvw.selectIsGamesLoading));
  }

  ngOnInit() {
    this.store.dispatch(GamesActions.loadGames());
    this.store.dispatch(GamesActions.loadGamesCachingResults());
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Opens the dialog for starting the caching process of the `Games`. After the
   * dialog has been closed the `cacheGames` action will be dispatched which
   * will start the caching process.
   *
   * In case the `User` dismissed the dialog no actions will be dispatched which
   * would otherwise trigger the effects for the respective action.
   */
  cacheGames() {
    this.hvwDialogService
      .showCacheGamesDialog()
      .pipe(
        filter(confirmed => !!confirmed),
        takeUntil(this.destroy$),
      )
      .subscribe(() => this.store.dispatch(GamesActions.cacheGames()));
  }

  /**
   * Dispatches the `refreshGames` action in order to reload the `Games` from
   * the API.
   */
  refreshGames() {
    this.store.dispatch(GamesActions.refreshGames());
  }

  /**
   * Dispatches the `deleteGames` action in order to remove all `Games` from
   * the `Database`.
   */
  deleteGames() {
    this.store.dispatch(GamesActions.deleteGames());
  }

  /**
   * Dispatches the `showSnackbar` action in order to notify the `User` that
   * the id of the respective `Game` of the row has been copied successfully
   * to the clipboard.
   */
  copyGameId() {
    this.store.dispatch(
      NotificationActions.showSnackbar({
        notification: {
          type: NotificationType.SUCCESS,
          message: 'Spiel-UID in Zwischenablage kopiert',
        },
      }),
    );
  }

  /**
   * This method checks if the given date is valid or not.
   * @param date The date which should get validated.
   */
  isDateValid(date: string) {
    return dayjs(date).isValid();
  }
}
