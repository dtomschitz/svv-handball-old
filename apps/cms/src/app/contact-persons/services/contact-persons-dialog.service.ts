import { Injectable, Injector } from '@angular/core';
import { ContactPerson } from '@svv/core/models';
import { DialogService } from '@svv/cms/core/services';
import {
  CreateOrEditContactPersonDialog,
  CreateOrEditContactPersonDialogData,
  SortContactPersonsDialog,
  SortContactPersonsDialogData,
} from '@svv/cms/contact-persons/components';

/**
 * This dialog service which contains methods for opening every dialog for the
 * `Contact Persons` feature.
 */
@Injectable()
export class ContactPersonsDialogService extends DialogService {
  constructor(injector: Injector) {
    super(injector);
  }

  /**
   * Opens the dialog which is used to either modify or create a `Contact Person`.
   */
  showCreateOrEditContactPersonDialog(
    data: CreateOrEditContactPersonDialogData,
  ) {
    return this.showDialog<
      CreateOrEditContactPersonDialog,
      CreateOrEditContactPersonDialogData,
      Partial<ContactPerson>
    >(CreateOrEditContactPersonDialog, {
      width: '512px',
      data,
    });
  }

  /**
   * Opens the dialog which is used to sort the `Contact Persons`
   * from the dialog data.
   *
   * @param data The dialog data which contains the `Contact Persons` that
   * should be sorted.
   */
  showSortContactPersonsDialog(data: SortContactPersonsDialogData) {
    return this.showDialog<
      SortContactPersonsDialog,
      SortContactPersonsDialogData,
      ContactPerson[]
    >(SortContactPersonsDialog, {
      width: '512px',
      data,
    });
  }

  /**
   * Opens the dialog which is used to enabled or disabled the `Contact Person`
   * from the dialog data.
   *
   * @param contactPerson The `Contact Person` which should get enabled or disabled.
   */
  showToggleContactPersonDialog(contactPerson: ContactPerson) {
    return this.showDefaultToggleDialog(contactPerson.disabled, {
      data: {
        title: `Ansprechpartner ${
          contactPerson.disabled ? 'aktivieren' : 'deaktivieren'
        }`,
        callout: {
          type: contactPerson.disabled ? 'INFO' : 'WARN',
          message: contactPerson.disabled
            ? 'Aktivierte Ansprechpartner werden auf der Webseite angezeigt!'
            : 'Deaktivierte Ansprechpartner werden auf der Webseite nicht angezeigt!',
        },
        item: {
          name: 'Ansprechpartner',
          line: contactPerson.name,
        },
      },
    });
  }

  /**
   * Opens the dialog which is used to delete the `Contact Person`
   * from the dialog data.
   *
   * @param contactPerson The `Contact Person` which should get deleted.
   */
  showDeleteContactPersonDialog(contactPerson: ContactPerson) {
    return this.showDefaultDeleteDialog({
      data: {
        title: 'Ansprechpartner löschen',
        callout: {
          type: 'WARN',
          message:
            'Wenn Sie einen Ansprechpartner löschen, wird dieser endgültig entfernt. Das Löschen von Ansprechpartner kann nicht rückgängig gemacht werden!',
        },
        item: {
          name: 'Ansprechpartner',
          line: contactPerson.name,
        },
      },
    });
  }
}
