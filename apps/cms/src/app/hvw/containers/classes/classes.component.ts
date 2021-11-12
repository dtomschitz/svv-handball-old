import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { HvwCachingResult, HvwClass, NotificationType } from '@svv/core/models';
import { NotificationActions } from '@svv/cms/core/store/actions';
import { ClassesActions } from '@svv/cms/hvw/store/actions';
import { HvwDialogService } from '@svv/cms/hvw/services';
import * as fromHvw from '@svv/cms/hvw/store/reducers';

/**
 * This component is used to display the `Classes` data table.
 */
@Component({
  selector: 'classes',
  templateUrl: './classes.component.html',
  styleUrls: ['./classes.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClassesComponent implements OnInit, OnDestroy {
  private readonly destroy$: Subject<void> = new Subject<void>();

  classes$: Observable<HvwClass[]>;
  cachingResults$: Observable<HvwCachingResult[]>;
  cachingResultsLoading$: Observable<boolean>;
  loading$: Observable<boolean>;

  /**
   * The columns which are displayed in the data table.
   */
  displayedColumns = ['id', 'shortName', 'longName', '_id', 'actions'];

  constructor(
    private store: Store<fromHvw.State>,
    private hvwDialogService: HvwDialogService,
  ) {
    this.classes$ = this.store.pipe(select(fromHvw.selectAllClasses));
    this.cachingResults$ = this.store.pipe(
      select(fromHvw.selectClassesCachingResults),
    );
    this.cachingResultsLoading$ = this.store.pipe(
      select(fromHvw.selectClassesCachingResultsLoading),
    );
    this.loading$ = this.store.pipe(select(fromHvw.selectIsClassesLoading));
  }

  ngOnInit() {
    this.store.dispatch(ClassesActions.loadClasses());
    this.store.dispatch(ClassesActions.loadClassesCachingResults());
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Opens the dialog for starting the caching process of the `Classes`. After
   * the dialog has been closed the `cacheClasses` action will be dispatched
   * which will start the caching process.
   *
   * In case the `User` dismissed the dialog no actions will be dispatched which
   * would otherwise trigger the effects for the respective action.
   */
  cacheClasses() {
    this.hvwDialogService
      .showCacheClassesDialog()
      .pipe(
        filter(confirmed => !!confirmed),
        takeUntil(this.destroy$),
      )
      .subscribe(() => this.store.dispatch(ClassesActions.cacheClasses()));
  }

  /**
   * Dispatches the `refreshClasses` action in order to reload the `Teams` from
   * the API.
   */
  refreshClasses() {
    this.store.dispatch(ClassesActions.refreshClasses());
  }

  /**
   * Dispatches the `deleteClasses` action in order to remove all `Classes` from
   * the `Database`.
   */
  deleteClasses() {
    this.store.dispatch(ClassesActions.deleteClasses());
  }

  /**
   * Dispatches the `showSnackbar` action in order to notify the `User` that
   * the id of the respective `Class` of the row has been copied successfully
   * to the clipboard.
   */
  copyClassId() {
    this.store.dispatch(
      NotificationActions.showSnackbar({
        notification: {
          type: NotificationType.SUCCESS,
          message: 'Spielklassen-UID in Zwischenablage kopiert',
        },
      }),
    );
  }
}
