import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { filter, map, takeUntil } from 'rxjs/operators';
import { NotificationType, User, UserRole } from '@svv/core/models';
import { DialogMode } from '@svv/cms/core/models';
import { NotificationActions } from '@svv/cms/core/store/actions';
import { UserActions, UsersActions } from '@svv/cms/users/store/actions';
import { UserDialogService } from '@svv/cms/users/services';
import * as fromUsers from '@svv/cms/users/store/reducers';

/**
 * This component is used to display the `Users` data table.
 */
@Component({
  selector: 'users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsersComponent implements OnInit, OnDestroy {
  private destroy$: Subject<void> = new Subject<void>();

  /**
   * The list of `Users` that should be displayed in the data table.
   */
  @Input() users: User[];

  /**
   * The default `User Role` that will be used for determining whether newly
   * created or edited user can be enabled for authentication.
   */
  @Input() defaultUserRole: UserRole;

  /**
   * The columns which are displayed in the data table.
   */
  @Input() displayedColumns = [
    'email',
    'firstName',
    'lastName',
    'lastLogin',
    '_id',
    'actions',
  ];

  loading$: Observable<boolean>;

  constructor(
    private store: Store<fromUsers.State>,
    private userDialogService: UserDialogService,
  ) {
    this.loading$ = this.store.pipe(select(fromUsers.selectIsLoading));
  }

  ngOnInit() {
    this.store.dispatch(UsersActions.loadUsers());
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Opens the dialog for creating a new `User`. After the dialog has been
   * closed the `createUser` action will be dispatched.
   *
   * In case the `User` dismissed the dialog no actions will be dispatched which
   * would otherwise trigger the effects for the respective action.
   *
   * The `User Role` will be set according to the given default `User Role`.
   */
  createUser() {
    this.userDialogService
      .showCreateOrEditUserDialog({
        mode: DialogMode.CREATE,
        canLogin: this.defaultUserRole === UserRole.ADMIN,
        disableCanLoginControl: this.defaultUserRole === UserRole.ADMIN,
      })
      .pipe(
        filter(user => !!user),
        map(user => ({
          ...user,
          role: this.defaultUserRole,
          canLogin: !!user.email && !!user.password,
        })),
        takeUntil(this.destroy$),
      )
      .subscribe(user => {
        return this.store.dispatch(UserActions.createUser({ user }));
      });
  }

  /**
   * Opens the dialog for toggle the authentication ability of the given `User`.
   * After the dialog has been closed the `updateUser` action will be dispatched.
   *
   * In case the `User` dismissed the dialog no actions will be dispatched which
   * would otherwise trigger the effects for the respective action.
   *
   * @param user The `User` which authentication should be either enabled
   * or disabled.
   */
  toggleUser(user: User) {
    this.userDialogService
      .showToggleUserDialog({ user })
      .pipe(
        filter(toggled => !!toggled),
        takeUntil(this.destroy$),
      )
      .subscribe(changes =>
        this.store.dispatch(
          UserActions.updateUser({
            update: {
              id: user._id,
              changes,
            },
          }),
        ),
      );
  }

  /**
   * Opens the dialog for modifying the given `User`. After the dialog has been
   * closed the `updateUser` action will be dispatched.
   *
   * In case the `User` dismissed the dialog no actions will be dispatched which
   * would otherwise trigger the effects for the respective action.
   *
   * @param user The `User` who should be modified.
   */
  editUser(user: User) {
    this.userDialogService
      .showCreateOrEditUserDialog({
        mode: DialogMode.EDIT,
        user,
        disableCanLoginControl: this.defaultUserRole === UserRole.ADMIN,
        canLogin: this.defaultUserRole === UserRole.ADMIN,
      })
      .pipe(
        filter(changes => !!changes),
        takeUntil(this.destroy$),
      )
      .subscribe(changes =>
        this.store.dispatch(
          UserActions.updateUser({
            update: {
              id: user._id,
              changes,
            },
          }),
        ),
      );
  }

  /**
   * Opens the dialog for modifying the password of the given `User`. After the
   * dialog has been closed the `updateUser` action will be dispatched.
   *
   * In case the `User` dismissed the dialog no actions will be dispatched which
   * would otherwise trigger the effects for the respective action.
   *
   * @param user The `User` who should be modified.
   */
  editUserPassword(user: User) {
    this.userDialogService
      .showEditUserPasswordDialog({ user })
      .pipe(
        filter(password => !!password),
        takeUntil(this.destroy$),
      )
      .subscribe(password =>
        this.store.dispatch(
          UserActions.updateUser({
            update: {
              id: user._id,
              changes: {
                password,
              },
            },
          }),
        ),
      );
  }

  /**
   * Opens the dialog for deleting the given `User`. After the dialog has been
   * closed the `deleteUser` action will be dispatched.
   *
   * In case the `User` dismissed the dialog no actions will be dispatched which
   * would otherwise trigger the effects for the respective action.
   *
   * @param user The `User` who should be deleted.
   */
  deleteUser(user: User) {
    this.userDialogService
      .showDeleteUserDialog(user)
      .pipe(
        filter(confirmed => !!confirmed),
        takeUntil(this.destroy$),
      )
      .subscribe(() =>
        this.store.dispatch(UserActions.deleteUser({ id: user._id })),
      );
  }

  /**
   * Dispatches the refresh `Users` action in order to reload the `Users` from
   * the API.
   */
  refreshUsers() {
    this.store.dispatch(UsersActions.refreshUsers());
  }

  /**
   * Dispatches the `showSnackbar` action in order to notify the `User` that
   * the id of the respective `User` of the row has been copied successfully
   * to the clipboard.
   */
  copyUserId() {
    this.store.dispatch(
      NotificationActions.showSnackbar({
        notification: {
          type: NotificationType.SUCCESS,
          message: 'Nutzer-ID in Zwischenablage kopiert',
        },
      }),
    );
  }
}
