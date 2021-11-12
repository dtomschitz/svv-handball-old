import { Injectable, Injector } from '@angular/core';
import { User } from '@svv/core/models';
import { DialogService } from '@svv/cms/core/services';
import {
  CreateOrEditUserDialog,
  CreateOrEditUserDialogData,
  EditUserPasswordDialog,
  EditUserPasswordDialogData,
  ToggleUserDialog,
  ToggleUserDialogData,
} from '@svv/cms/users/components';

/**
 * This dialog service which contains methods for opening every dialog for the
 * `Users` feature.
 */
@Injectable()
export class UserDialogService extends DialogService {
  constructor(injector: Injector) {
    super(injector);
  }

  /**
   * Opens the dialog which is used to either modify or create a `User`.
   */
  showCreateOrEditUserDialog(data: CreateOrEditUserDialogData) {
    return this.showDialog<
      CreateOrEditUserDialog,
      CreateOrEditUserDialogData,
      Partial<User>
    >(CreateOrEditUserDialog, {
      width: '312px',
      data,
    });
  }

  /**
   * Opens the dialog which is used to enabled or disabled the authentication
   * of the `User` from the dialog data.
   *
   * @param data The dialog data which contains the `User`.
   */
  showToggleUserDialog(data: ToggleUserDialogData) {
    return this.showDialog<
      ToggleUserDialog,
      ToggleUserDialogData,
      Partial<User>
    >(ToggleUserDialog, {
      width: '512px',
      data,
    });
  }

  /**
   * Opens the dialog which is used to modify the password of the `User`
   * from the dialog data.
   *
   * @param data The dialog data which contains the `User`.
   */
  showEditUserPasswordDialog(data: EditUserPasswordDialogData) {
    return this.showDialog<EditUserPasswordDialog, any, string>(
      EditUserPasswordDialog,
      {
        width: '512px',
        data,
      },
    );
  }

  /**
   * Opens the dialog which is used to delete the `User` from the dialog data.
   *
   * @param user The `User` which should get deleted.
   */
  showDeleteUserDialog(user: User) {
    return this.showDefaultDeleteDialog({
      data: {
        title: 'Nutzer löschen',
        callout: {
          type: 'WARN',
          message:
            'Wenn Sie ein Nutzer löschen, wird dieser endgültig entfernt. Das Löschen von Nutzern kann nicht rückgängig gemacht werden!',
        },
        item: {
          name: 'Nutzer',
          line: user?.email ? user.email : `${user.firstName} ${user.lastName}`,
        },
      },
    });
  }
}
