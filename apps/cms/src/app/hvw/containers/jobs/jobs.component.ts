import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { select, Store } from '@ngrx/store';
import { HvwCachingType, HvwJob, NotificationType } from '@svv/core/models';
import { DialogMode } from '@svv/cms/core/models';
import { NotificationActions } from '@svv/cms/core/store/actions';
import { getCachingTypes, getCronExpressions } from '@svv/cms/shared/constants';
import { JobActions, JobsActions } from '@svv/cms/hvw/store/actions';
import { HvwDialogService } from '@svv/cms/hvw/services';
import cronstrue from 'cronstrue/i18n';
import * as fromHvw from '@svv/cms/hvw/store/reducers';

/**
 * This component is used to display the `CronJobs` data table.
 */
@Component({
  selector: 'jobs',
  templateUrl: './jobs.component.html',
  styleUrls: ['./jobs.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JobsComponent implements OnInit, OnDestroy {
  private readonly destroy$: Subject<void> = new Subject<void>();

  jobs$: Observable<HvwJob[]>;
  loading$: Observable<boolean>;

  cachingTypes = getCachingTypes();
  cronOptions = getCronExpressions();

  /**
   * The columns which are display in the data table.
   */
  displayedColumns = ['name', 'type', 'cronExpression', '_id', 'actions'];

  constructor(
    private store: Store<fromHvw.State>,
    private hvwDialogService: HvwDialogService,
  ) {
    this.jobs$ = this.store.pipe(select(fromHvw.selectAllJobs));
    this.loading$ = this.store.pipe(select(fromHvw.selectIsJobsLoading));
  }

  ngOnInit() {
    this.store.dispatch(JobsActions.loadJobs());
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Opens the dialog for creating a new `CronJob`. After the dialog has been
   * closed the `createJob` action will be dispatched which will create the new
   * `CronJob` based on the given form values.
   *
   * In case the `User` dismissed the dialog no actions will be dispatched which
   * would otherwise trigger the effects for the respective action.
   */
  createJob() {
    this.hvwDialogService
      .showCreateOrEditJobDialog({ mode: DialogMode.CREATE })
      .pipe(
        filter(job => !!job),
        takeUntil(this.destroy$),
      )
      .subscribe(job => this.store.dispatch(JobActions.createJob({ job })));
  }

  /**
   * Opens the dialog for modifying a existing `CronJob`. After the dialog has
   * been closed the `updateJob` action will be dispatched which will update the
   * specific `CronJob` based on the given changes.
   *
   * In case the `User` dismissed the dialog no actions will be dispatched which
   * would otherwise trigger the effects for the respective action.
   *
   * @param job The `CronJob` which gets modified.
   */
  editJob(job: HvwJob) {
    this.hvwDialogService
      .showCreateOrEditJobDialog({ mode: DialogMode.EDIT, job })
      .pipe(
        filter(changes => !!changes),
        takeUntil(this.destroy$),
      )
      .subscribe(changes =>
        this.store.dispatch(
          JobActions.updateJob({
            update: {
              id: job._id,
              changes,
            },
          }),
        ),
      );
  }

  /**
   * Opens the dialog for enabling or disabling the given `CronJob`. After the
   * dialog has been closed the `updateJob` action will be dispatched which will
   * either enable or disable the `CronJob` based on the previous value.
   *
   * In case the `User` dismissed the dialog no actions will be dispatched which
   * would otherwise trigger the effects for the respective action.
   *
   * @param job The `CronJob` which gets modified.
   */
  toggleJob(job: HvwJob) {
    this.hvwDialogService
      .showToggleJobDialog(job)
      .pipe(
        filter(toggled => !!toggled),
        takeUntil(this.destroy$),
      )
      .subscribe(() =>
        this.store.dispatch(
          JobActions.updateJob({
            update: {
              id: job._id,
              changes: {
                disabled: !job.disabled,
              },
            },
          }),
        ),
      );
  }

  /**
   * Opens the dialog for deleting the given `CronJob`. After the dialog has
   * been closed the `deleteJob` action will be dispatched which will start the
   * deletion process for the `CronJob`.
   *
   * In case the `User` dismissed the dialog no actions will be dispatched which
   * would otherwise trigger the effects for the respective action.
   *
   * @param sponsor The `CronJob` which gets deleted.
   */
  deleteJob(job: HvwJob) {
    this.hvwDialogService
      .showDeleteJobDialog(job)
      .pipe(
        filter(confirmed => !!confirmed),
        takeUntil(this.destroy$),
      )
      .subscribe(() =>
        this.store.dispatch(JobActions.deleteJob({ id: job._id })),
      );
  }

  /**
   * Dispatches the `refreshJobs` action in order to reload the `CronJobs` from
   * the API.
   */
  refreshJobs() {
    this.store.dispatch(JobsActions.refreshJobs());
  }

  /**
   * Dispatches the `showSnackbar` action in order to notify the `User` that
   * the id of the respective `CronJob` of the row has been copied successfully
   * to the clipboard.
   */
  copyJobId() {
    this.store.dispatch(
      NotificationActions.showSnackbar({
        notification: {
          type: NotificationType.SUCCESS,
          message: 'Cronjob-UID in Zwischenablage kopiert',
        },
      }),
    );
  }

  getCachingType(type: HvwCachingType) {
    return this.cachingTypes.find(({ value }) => type === value).name;
  }

  getCronText(cron: string) {
    return cronstrue.toString(cron, { locale: 'de' });
  }
}
