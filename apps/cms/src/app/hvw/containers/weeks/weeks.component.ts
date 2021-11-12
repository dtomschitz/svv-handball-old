import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { HvwCachingResult, HvwWeek, NotificationType } from '@svv/core/models';
import { NotificationActions } from '@svv/cms/core/store/actions';
import { WeeksActions } from '@svv/cms/hvw/store/actions';
import { HvwDialogService } from '@svv/cms/hvw/services';
import * as fromHvw from '@svv/cms/hvw/store/reducers';
import * as dayjs from 'dayjs';

@Component({
  selector: 'weeks',
  templateUrl: './weeks.component.html',
  styleUrls: ['./weeks.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WeeksComponent implements OnInit, OnDestroy {
  private readonly destroy$: Subject<void> = new Subject<void>();

  weeks$: Observable<HvwWeek[]>;
  cachingResults$: Observable<HvwCachingResult[]>;
  cachingResultsLoading$: Observable<boolean>;
  loading$: Observable<boolean>;

  /**
   * The columns which are displayed in the data table.
   */
  displayedColumns = ['date', '_id', 'actions'];

  constructor(
    private store: Store<fromHvw.State>,
    private hvwDialogService: HvwDialogService,
  ) {
    this.weeks$ = this.store.pipe(select(fromHvw.selectAllWeeks));
    this.cachingResults$ = this.store.pipe(
      select(fromHvw.selectWeeksCachingResults),
    );
    this.cachingResultsLoading$ = this.store.pipe(
      select(fromHvw.selectWeeksCachingResultsLoading),
    );
    this.loading$ = this.store.pipe(select(fromHvw.selectIsWeeksLoading));
  }

  ngOnInit() {
    this.store.dispatch(WeeksActions.loadWeeks());
    this.store.dispatch(WeeksActions.loadWeeksCachingResults());
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
  cacheWeeks() {
    this.hvwDialogService
      .showCacheWeeksDialog()
      .pipe(
        filter(confirmed => !!confirmed),
        takeUntil(this.destroy$),
      )
      .subscribe(() => this.store.dispatch(WeeksActions.cacheWeeks()));
  }

  /**
   * Dispatches the `refreshWeeks` action in order to reload the `Weeks` from
   * the API.
   */
  refreshWeeks() {
    this.store.dispatch(WeeksActions.refreshWeeks());
  }

  /**
   * Dispatches the `deleteWeeks` action in order to remove all `Weeks` from
   * the `Database`.
   */
  deleteWeeks() {
    this.store.dispatch(WeeksActions.deleteWeeks());
  }

  /**
   * Dispatches the `showSnackbar` action in order to notify the `User` that
   * the id of the respective `Week` of the row has been copied successfully
   * to the clipboard.
   */
  copyWeekId() {
    this.store.dispatch(
      NotificationActions.showSnackbar({
        notification: {
          type: NotificationType.SUCCESS,
          message: 'Week-UID in Zwischenablage kopiert',
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
