import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { HvwCachingResult, HvwTable, NotificationType } from '@svv/core/models';
import { NotificationActions } from '@svv/cms/core/store/actions';
import { TablesActions } from '@svv/cms/hvw/store/actions';
import { HvwDialogService } from '@svv/cms/hvw/services';
import * as fromHvw from '@svv/cms/hvw/store/reducers';

/**
 * This component is used to display the `Tables` data table.
 */
@Component({
  selector: 'tables',
  templateUrl: './tables.component.html',
  styleUrls: ['./tables.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TablesComponent implements OnInit, OnDestroy {
  private readonly destroy$: Subject<void> = new Subject<void>();

  tables$: Observable<HvwTable[]>;
  cachingResults$: Observable<HvwCachingResult[]>;
  cachingResultsLoading$: Observable<boolean>;
  loading$: Observable<boolean>;

  /**
   * The columns which are displayed in the data table.
   */
  displayedColumns = ['class', '_id', 'actions'];

  constructor(
    private store: Store<fromHvw.State>,
    private hvwDialogService: HvwDialogService,
  ) {
    this.tables$ = this.store.pipe(select(fromHvw.selectAllTables));
    this.cachingResults$ = this.store.pipe(
      select(fromHvw.selectTablesCachingResults),
    );
    this.cachingResultsLoading$ = this.store.pipe(
      select(fromHvw.selectTablesCachingResultsLoading),
    );
    this.loading$ = this.store.pipe(select(fromHvw.selectIsTablesLoading));
  }

  ngOnInit() {
    this.store.dispatch(TablesActions.loadTables());
    this.store.dispatch(TablesActions.loadTablesCachingResults());
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Opens the dialog for starting the caching process of the `Weeks`. After the
   * dialog has been closed the `cacheWeeks` action will be dispatched which will
   * start the caching process.
   *
   * In case the `User` dismissed the dialog no actions will be dispatched which
   * would otherwise trigger the effects for the respective action.
   */
  cacheTables() {
    this.hvwDialogService
      .showCacheTablesDialog()
      .pipe(
        filter(confirmed => !!confirmed),
        takeUntil(this.destroy$),
      )
      .subscribe(() => this.store.dispatch(TablesActions.cacheTables()));
  }

  /**
   * Dispatches the `refreshTables` action in order to reload the `Tables` from
   * the API.
   */
  refreshTables() {
    this.store.dispatch(TablesActions.refreshTables());
  }

  /**
   * Dispatches the `deleteTables` action in order to remove all `Tables` from
   * the `Database`.
   */
  deleteTables() {
    this.store.dispatch(TablesActions.deleteTables());
  }

  /**
   * Dispatches the `showSnackbar` action in order to notify the `User` that
   * the id of the respective `Table` of the row has been copied successfully
   * to the clipboard.
   */
  copyTableId() {
    this.store.dispatch(
      NotificationActions.showSnackbar({
        notification: {
          type: NotificationType.SUCCESS,
          message: 'Tabelle-UID in Zwischenablage kopiert',
        },
      }),
    );
  }
}
