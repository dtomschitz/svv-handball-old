import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { filter, map, takeUntil } from 'rxjs/operators';
import {
  ContactPerson,
  ContactPersonCategory,
  NotificationType,
} from '@svv/core/models';
import { DialogMode } from '@svv/cms/core/models';
import { NotificationActions } from '@svv/cms/core/store/actions';
import {
  ContactPersonActions,
  ContactPersonCategoriesActions,
  ContactPersonsActions,
} from '@svv/cms/contact-persons/store/actions';
import { ContactPersonsDialogService } from '@svv/cms/contact-persons/services';
import * as fromContactPersons from '@svv/cms/contact-persons/store/reducers';

/**
 * This component is used to display the `Contact Persons` data table.
 */
@Component({
  selector: 'contact-persons',
  templateUrl: './contact-persons.component.html',
  styleUrls: ['./contact-persons.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactPersonsComponent implements OnInit, OnDestroy {
  private readonly destroy$: Subject<void> = new Subject<void>();

  contactPersons$: Observable<ContactPerson[]>;
  categories$: Observable<ContactPersonCategory[]>;
  loading$: Observable<boolean>;

  /**
   * The columns which are displayed in the data table.
   */
  displayedColumns = ['name', 'email', 'people', '_id', 'actions'];

  constructor(
    private store: Store<fromContactPersons.State>,
    private contactPersonsDialogService: ContactPersonsDialogService,
  ) {
    this.contactPersons$ = this.store.pipe(
      select(fromContactPersons.selectAllContactPersons),
    );
    this.categories$ = this.store.pipe(
      select(fromContactPersons.selectAllContactPersonCategories),
    );
    this.loading$ = this.store.pipe(
      select(fromContactPersons.selectIsContactPersonsLoading),
    );
  }

  ngOnInit() {
    this.store.dispatch(ContactPersonsActions.loadContactPersons());
    this.store.dispatch(
      ContactPersonCategoriesActions.loadContactPersonCategories(),
    );
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Opens the dialog for creating a new `Contact Person`. After the dialog has
   * been closed the `createContactPerson` action will be dispatched which will
   * create the new `Contact Person` based on the given form values.
   *
   * In case the `User` dismissed the dialog no actions will be dispatched which
   * would otherwise trigger the effects for the respective action.
   *
   * @param categories The list of `Contact Person Categories` of which the `User`
   * can select one.
   *
   * @param length The current `Contact Persons` total.
   */
  createContactPerson(categories: ContactPersonCategory[], length: number) {
    this.contactPersonsDialogService
      .showCreateOrEditContactPersonDialog({
        mode: DialogMode.CREATE,
        categories,
      })
      .pipe(
        filter(contactPerson => !!contactPerson),
        map(contactPerson => ({
          ...contactPerson,
          position: length++,
        })),
        takeUntil(this.destroy$),
      )
      .subscribe(contactPerson => {
        this.store.dispatch(
          ContactPersonActions.createContactPerson({ contactPerson }),
        );
      });
  }

  /**
   * Opens the dialog for modifying a existing `Contact Person`. After the
   * dialog has been closed the `updateContactPerson` action will be dispatched
   * which will update the specific `Contact Person` based on the given changes.
   *
   * In case the `User` dismissed the dialog no actions will be dispatched which
   * would otherwise trigger the effects for the respective action.
   *
   * @param contactPerson The `Contact Person` which gets modified.
   *
   * @param categories The list of `Contact Person Categories` of which the `User`
   * can select one.
   *
   */
  editContactPerson(
    contactPerson: ContactPerson,
    categories: ContactPersonCategory[],
  ) {
    this.contactPersonsDialogService
      .showCreateOrEditContactPersonDialog({
        mode: DialogMode.EDIT,
        contactPerson,
        categories,
      })
      .pipe(
        filter(changes => !!changes),
        takeUntil(this.destroy$),
      )
      .subscribe(changes => {
        this.store.dispatch(
          ContactPersonActions.updateContactPerson({
            update: {
              id: contactPerson._id,
              changes,
            },
          }),
        );
      });
  }

  /**
   * Opens the dialog for enabling or disabling the given `Contact Person`.
   * After the dialog has been closed the `updateContactPerson` action will be
   * dispatched which will either enable or disable the `Contact Person` based
   * on the previous value.
   *
   * In case the `User` dismissed the dialog no actions will be dispatched which
   * would otherwise trigger the effects for the respective action.
   *
   * @param contactPerson The `Contact Person` which gets modified.
   */
  toggleContactPerson(contactPerson: ContactPerson) {
    this.contactPersonsDialogService
      .showToggleContactPersonDialog(contactPerson)
      .pipe(
        filter(toggled => !!toggled),
        takeUntil(this.destroy$),
      )
      .subscribe(() => {
        this.store.dispatch(
          ContactPersonActions.updateContactPerson({
            update: {
              id: contactPerson._id,
              changes: {
                disabled: !contactPerson.disabled,
              },
            },
          }),
        );
      });
  }

  /**
   * Opens the dialog for sorting all `Contact Persons`. After the dialog has
   * been closed the `updateContactPersons` action will be dispatched which will
   * update the positions of all `Contact Persons`.
   *
   * In case the `User` dismissed the dialog no actions will be dispatched which
   * would otherwise trigger the effects for the respective action.
   *
   * @param contactPersons The list of currently existing `Contact Persons`.
   *
   * @param categories The list of currently existing `Contact Person Categories`.
   *
   */
  sortContactPersons(
    contactPersons: ContactPerson[],
    categories: ContactPersonCategory[],
  ) {
    this.contactPersonsDialogService
      .showSortContactPersonsDialog({ contactPersons, categories })
      .pipe(
        filter(sortedContactPersons => !!sortedContactPersons),
        map(sortedContactPersons =>
          sortedContactPersons.map(contactPerson => ({
            _id: contactPerson._id,
            position: contactPerson.position,
          })),
        ),
        takeUntil(this.destroy$),
      )
      .subscribe(sortedContactPersons => {
        this.store.dispatch(
          ContactPersonsActions.sortContactPersons({
            updates: sortedContactPersons.map((contactPerson, position) => ({
              id: contactPerson._id,
              changes: {
                position,
              },
            })),
          }),
        );
      });
  }

  /**
   * Opens the dialog for deleting the given `Contact Person`. After the dialog has
   * been closed the `deleteSponsor` action will be dispatched which will start
   * the deletion process for the `Contact Person`.
   *
   * In case the `User` dismissed the dialog no actions will be dispatched which
   * would otherwise trigger the effects for the respective action.
   *
   * @param sponsor The `Contact Person` which gets deleted.
   */
  deleteContactPerson(contactPerson: ContactPerson) {
    this.contactPersonsDialogService
      .showDeleteContactPersonDialog(contactPerson)
      .pipe(
        filter(confirmed => !!confirmed),
        takeUntil(this.destroy$),
      )
      .subscribe(() =>
        this.store.dispatch(
          ContactPersonActions.deleteContactPerson({
            id: contactPerson._id,
          }),
        ),
      );
  }

  /**
   * Dispatches the `showSnackbar` action in order to notify the `User` that
   * the id of the respective `Contact Person` of the row has been copied
   * successfully to the clipboard.
   */
  copyContactPersonId(event: MouseEvent) {
    this.preventDefault(event);
    this.store.dispatch(
      NotificationActions.showSnackbar({
        notification: {
          type: NotificationType.SUCCESS,
          message: 'Ansprechpartner-ID in Zwischenablage kopiert',
        },
      }),
    );
  }

  /**
   * Dispatches the `refreshContactPersons` action in order to reload the
   * `Contact Persons` from the API.
   */
  refreshContactPersons() {
    this.store.dispatch(ContactPersonsActions.refreshContactPersons());
  }

  preventDefault(event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
  }
}
