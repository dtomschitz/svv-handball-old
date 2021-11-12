import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { filter, map, takeUntil } from 'rxjs/operators';
import { NotificationType, Sponsor } from '@svv/core/models';
import { DialogMode } from '@svv/cms/core/models';
import { NotificationActions } from '@svv/cms/core/store/actions';
import {
  SponsorActions,
  SponsorsActions,
} from '@svv/cms/sponsors/store/actions';
import { SponsorDialogService } from '@svv/cms/sponsors/services';
import * as fromSponsors from '@svv/cms/sponsors/store/reducers';

/**
 * This component is used to display the `Sponsors` data table.
 */
@Component({
  selector: 'sponsors',
  templateUrl: './sponsors.component.html',
  styleUrls: ['./sponsors.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SponsorsComponent implements OnInit, OnDestroy {
  private readonly destroy$: Subject<void> = new Subject<void>();

  sponsors$: Observable<Sponsor[]>;
  loading$: Observable<boolean>;

  /**
   * The columns which are displayed in the data table.
   */
  displayedColumns = ['name', 'link', '_id', 'actions'];
  expandedSponsor: Sponsor;

  constructor(
    private store: Store<fromSponsors.State>,
    private sponsorDialogService: SponsorDialogService,
  ) {
    this.sponsors$ = this.store.pipe(select(fromSponsors.selectAllSponsors));
    this.loading$ = this.store.pipe(select(fromSponsors.selectIsLoading));
  }

  ngOnInit() {
    this.store.dispatch(SponsorsActions.loadSponsors());
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Updates the currently selected `Sponsor` in order to display it in the
   * expanded details component.
   *
   * @param sponsor The selected `Sponsor`.
   */
  onRowExpanded(sponsor: Sponsor) {
    if (sponsor) {
      this.expandedSponsor = sponsor;
    }
  }

  /**
   * Opens the dialog for creating a new `Sponsor`. After the dialog has been
   * closed the `createSponsor` action will be dispatched which will create the
   *  new `Sponsor` based on the given form values.
   *
   * In case the `User` dismissed the dialog no actions will be dispatched which
   * would otherwise trigger the effects for the respective action.
   *
   * @param length The current `Sponsors` total.
   */
  createSponsor(length: number) {
    this.sponsorDialogService
      .showCreateOrEditSponsorDialog({ mode: DialogMode.CREATE })
      .pipe(
        filter(sponsor => !!sponsor),
        map(sponsor => ({
          ...sponsor,
          position: length++,
        })),
        takeUntil(this.destroy$),
      )
      .subscribe(sponsor =>
        this.store.dispatch(SponsorActions.createSponsor({ sponsor })),
      );
  }

  /**
   * Opens the dialog for modifying a existing `Sponsor`. After the dialog has
   * been closed the `updateSponsor` action will be dispatched which will update
   * the specific `Sponsor` based on the given changes.
   *
   * In case the `User` dismissed the dialog no actions will be dispatched which
   * would otherwise trigger the effects for the respective action.
   *
   * @param sponsor The `Sponsor` which gets modified.
   */
  editSponsor(sponsor: Sponsor) {
    this.sponsorDialogService
      .showCreateOrEditSponsorDialog({ mode: DialogMode.EDIT, sponsor })
      .pipe(
        filter(changes => !!changes),
        takeUntil(this.destroy$),
      )
      .subscribe(changes =>
        this.store.dispatch(
          SponsorActions.updateSponsor({
            update: {
              id: sponsor._id,
              changes,
            },
          }),
        ),
      );
  }

  /**
   * Opens the dialog for modifying the image of the given `Sponsor`. After the
   * dialog has been closed the `uploadSponsorImage` action will be dispatched
   * which will upload the selected image for the `Sponsor`.
   *
   * In case the `User` dismissed the dialog no actions will be dispatched which
   * would otherwise trigger the effects for the respective action.
   *
   * @param sponsor The `Sponsor` which gets modified.
   */
  editSponsorImage(sponsor: Sponsor) {
    this.sponsorDialogService
      .showEditSponsorImageDialog()
      .pipe(
        filter(image => !!image),
        takeUntil(this.destroy$),
      )
      .subscribe(image =>
        this.store.dispatch(
          SponsorActions.uploadSponsorImage({ id: sponsor._id, image }),
        ),
      );
  }

  /**
   * Opens the dialog for enabling or disabling the given `Sponsor`. After the
   * dialog has been closed the `updateSponsor` action will be dispatched which
   * will either enable or disable the `Sponsor` based on the previous value.
   *
   * In case the `User` dismissed the dialog no actions will be dispatched which
   * would otherwise trigger the effects for the respective action.
   *
   * @param sponsor The `Sponsor` which gets modified.
   */
  toggleSponsor(sponsor: Sponsor) {
    this.sponsorDialogService
      .showToggleSponsorDialog(sponsor)
      .pipe(
        filter(toggled => !!toggled),
        takeUntil(this.destroy$),
      )
      .subscribe(() =>
        this.store.dispatch(
          SponsorActions.updateSponsor({
            update: {
              id: sponsor._id,
              changes: {
                disabled: !sponsor.disabled,
              },
            },
          }),
        ),
      );
  }

  /**
   * Opens the dialog for enabling or disabling the image of the given `Sponsor`.
   * After the dialog has been closed the `updateSponsor` action will be
   * dispatched which  will either enable or disable the image of the `Sponsor`
   * based on the previous value.
   *
   * In case the `User` dismissed the dialog no actions will be dispatched which
   * would otherwise trigger the effects for the respective action.
   *
   * @param sponsor The `Sponsor` which gets modified.
   */
  toggleSponsorImage(sponsor: Sponsor) {
    this.sponsorDialogService
      .showToggleSponsorImageDialog(sponsor)
      .pipe(
        filter(toggled => !!toggled),
        takeUntil(this.destroy$),
      )
      .subscribe(() => {
        this.store.dispatch(
          SponsorActions.updateSponsor({
            update: {
              id: sponsor._id,
              changes: {
                img: {
                  ...sponsor.img,
                  disabled: !sponsor.img.disabled,
                },
              },
            },
          }),
        );
      });
  }

  /**
   * Opens the dialog for sorting all `Sponsors`. After the dialog has been
   * closed the `updateSponsors` action will be dispatched which will update the
   * positions of all `Sponsors`.
   *
   * In case the `User` dismissed the dialog no actions will be dispatched which
   * would otherwise trigger the effects for the respective action.
   *
   * @param sponsors The list of currently existing `Sponsors`.
   */
  sortSponsors(sponsors: Sponsor[]) {
    this.sponsorDialogService
      .showSortSponsorsDialog({ sponsors })
      .pipe(
        filter(sortedSponsors => !!sortedSponsors),
        map(sortedSponsors =>
          sortedSponsors.map(sponsor => ({
            _id: sponsor._id,
            position: sponsor.position,
          })),
        ),
        takeUntil(this.destroy$),
      )
      .subscribe(sortedSponsors => {
        this.store.dispatch(
          SponsorsActions.sortSponsors({
            updates: sortedSponsors.map((sponsor, position) => ({
              id: sponsor._id,
              changes: {
                position,
              },
            })),
          }),
        );
      });
  }

  /**
   * Opens the dialog for deleting the image of the given `Sponsor`. After the
   * dialog has been closed the `deleteSponsorImage` action will be dispatched
   * which will start the deletion process for the image of the `Sponsor`.
   *
   * In case the `User` dismissed the dialog no actions will be dispatched which
   * would otherwise trigger the effects for the respective action.
   *
   * @param sponsor The `Sponsor` which gets modified.
   */
  deleteSponsorImage(sponsor: Sponsor) {
    this.sponsorDialogService
      .showDeleteSponsorImageDialog(sponsor)
      .pipe(
        filter(confirmed => !!confirmed),
        takeUntil(this.destroy$),
      )
      .subscribe(() =>
        this.store.dispatch(
          SponsorActions.deleteSponsorImage({ id: sponsor._id }),
        ),
      );
  }

  /**
   * Opens the dialog for deleting the given `Sponsor`. After the dialog has
   * been closed the `deleteSponsor` action will be dispatched which will start
   * the deletion process for the `Sponsor`.
   *
   * In case the `User` dismissed the dialog no actions will be dispatched which
   * would otherwise trigger the effects for the respective action.
   *
   * @param sponsor The `Sponsor` which gets deleted.
   */
  deleteSponsor(sponsor: Sponsor) {
    this.sponsorDialogService
      .showDeleteSponsorDialog(sponsor)
      .pipe(
        filter(confirmed => !!confirmed),
        takeUntil(this.destroy$),
      )
      .subscribe(() => {
        return this.store.dispatch(
          SponsorActions.deleteSponsor({
            id: sponsor._id,
          }),
        );
      });
  }

  /**
   * Dispatches the `showSnackbar` action in order to notify the `User` that
   * the id of the respective `Sponsor` of the row has been copied successfully
   * to the clipboard.
   */
  copySponsorId(event: MouseEvent) {
    this.preventDefault(event);
    this.store.dispatch(
      NotificationActions.showSnackbar({
        notification: {
          type: NotificationType.SUCCESS,
          message: 'Sponsor-ID in Zwischenablage kopiert',
        },
      }),
    );
  }

  /**
   * Dispatches the `refreshSponsors` action in order to reload the `Sponsors`
   * from the API.
   */
  refreshSponsors() {
    this.store.dispatch(SponsorsActions.refreshSponsors());
  }

  preventDefault(event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
  }
}
