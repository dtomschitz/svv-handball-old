import { Injectable, Injector } from '@angular/core';
import { Sponsor } from '@svv/core/models';
import { DialogService } from '@svv/cms/core/services';
import {
  CreateOrEditSponsorDialog,
  EditSponsorImageDialog,
  SortSponsorsDialog,
  SortSponsorsDialogData,
  CreateOrEditSponsorDialogData,
} from '@svv/cms/sponsors/components';

/**
 * This dialog service which contains methods for opening every dialog for the
 * `Sponsors` feature.
 */
@Injectable()
export class SponsorDialogService extends DialogService {
  constructor(injector: Injector) {
    super(injector);
  }

  /**
   * Opens the dialog which is used to either modify or create a `Sponsor`.
   */
  showCreateOrEditSponsorDialog(data: CreateOrEditSponsorDialogData) {
    return this.showDialog<
      CreateOrEditSponsorDialog,
      CreateOrEditSponsorDialogData,
      Partial<Sponsor>
    >(CreateOrEditSponsorDialog, {
      width: '312px',
      data,
    });
  }

  /**
   * Opens the dialog which is used to modify the image of the respective
   * `Sponsor` from the dialog data.
   */
  showEditSponsorImageDialog() {
    return this.showDialog<EditSponsorImageDialog, any, File>(
      EditSponsorImageDialog,
      {
        width: '512px',
      },
    );
  }

  /**
   * Opens the dialog which is used to enabled or disabled the `Sponsor` from
   * the dialog data.
   *
   * @param sponsor The `Sponsor` which should get enabled or disabled.
   */
  showToggleSponsorDialog(sponsor: Sponsor) {
    return this.showDefaultToggleDialog(sponsor.disabled, {
      data: {
        title: `Sponsor ${sponsor.disabled ? 'aktivieren' : 'deaktivieren'}`,
        callout: {
          type: sponsor.disabled ? 'INFO' : 'WARN',
          message: sponsor.disabled
            ? 'Aktivierte Sponsoren werden auf der Webseite angezeigt!'
            : 'Deaktivierte Sponsoren werden auf der Webseite nicht angezeigt!',
        },
        item: {
          name: 'Sponsor',
          line: sponsor.name,
        },
      },
    });
  }

  /**
   * Opens the dialog which is used to enabled or disabled the image of the
   * `Sponsor` from the dialog data.
   *
   * @param sponsor The `Sponsor` of which the image should be enabled or disabled.
   */
  showToggleSponsorImageDialog(sponsor: Sponsor) {
    return this.showDefaultToggleDialog(sponsor.img.disabled, {
      data: {
        title: `Sponsor ${
          sponsor.img.disabled ? 'aktivieren' : 'deaktivieren'
        }`,
        callout: {
          type: sponsor.img.disabled ? 'INFO' : 'WARN',
          message: sponsor.img.disabled
            ? 'Aktivierte Sponsorenfotos können auf der Homepage von Besuchern gesehen werden!'
            : 'Deaktivierte Sponsorenfotos können auf der Homepage von Besuchern nicht mehr gesehen werden!',
        },
        item: {
          name: 'Sponsor',
          line: sponsor.name,
        },
      },
    });
  }

  /**
   * Opens the dialog which is used to delete the image of the `Sponsor` from
   * the dialog data.
   *
   * @param sponsor The `Sponsor` of which the image should be deleted.
   */
  showDeleteSponsorImageDialog(sponsor: Sponsor) {
    return this.showDefaultDeleteDialog({
      data: {
        title: 'Sponsorfoto',
        callout: {
          type: 'WARN',
          message:
            'Das löschen des Sponsorenfotos kann nicht rückgänig gemacht werden!',
        },
        item: {
          name: 'Sponsor',
          line: sponsor.name,
        },
      },
    });
  }

  /**
   * Opens the dialog which is used to delete the `Sponsor` from the dialog data.
   *
   * @param sponsor The `Sponsor` which should get deleted.
   */
  showDeleteSponsorDialog(sponsor: Sponsor) {
    return this.showDefaultDeleteDialog({
      data: {
        title: 'Sponsor löschen',
        callout: {
          type: 'WARN',
          message:
            'Wenn Sie ein Sponsor löschen, wird dieser endgültig entfernt. Das Löschen von Sponsoren kann nicht rückgängig gemacht werden!',
        },
        item: {
          name: 'Sponsor',
          line: sponsor.name,
        },
      },
    });
  }

  /**
   * Opens the dialog which is used to sort the `Sponsors` from the dialog data.
   *
   * @param data The dialog data which contains the `Sponsors` that should
   * be sorted.
   */
  showSortSponsorsDialog(data: SortSponsorsDialogData) {
    return this.showDialog<
      SortSponsorsDialog,
      SortSponsorsDialogData,
      Sponsor[]
    >(SortSponsorsDialog, {
      data,
    });
  }
}
