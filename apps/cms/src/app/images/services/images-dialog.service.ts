import { Injectable, Injector } from '@angular/core';
import { DialogService } from '@svv/cms/core/services';
import { Image } from '@svv/core/models';
import {
  CreateOrEditImageDialog,
  CreateOrEditImageDialogData,
} from '@svv/cms/images/components';

@Injectable()
export class ImagesDialogService extends DialogService {
  constructor(injector: Injector) {
    super(injector);
  }

  /**
   * Opens the dialog which is used to either modify or create a `Image`.
   */
  showCreateOrEditImageDialog(data: CreateOrEditImageDialogData) {
    return this.showDialog<
      CreateOrEditImageDialog,
      CreateOrEditImageDialogData,
      { image: Partial<Image>; file: File }
    >(CreateOrEditImageDialog, {
      width: '512px',
      data,
    });
  }

  /**
   * Opens the dialog which is used to enabled or disabled the `Image` from the
   * dialog data.
   *
   * @param image The `Image` which should get enabled or disabled.
   */
  showToggleImageDialog(image: Image) {
    return this.showDefaultToggleDialog(image.disabled, {
      data: {
        title: `Bild ${image.disabled ? 'aktivieren' : 'deaktivieren'}`,
        callout: {
          type: image.disabled ? 'INFO' : 'WARN',
          message: image.disabled
            ? 'Aktivierte Bilder können auf der Webseite angezeigt werden!'
            : 'Deaktivierte Bilder werden auf der Webseite nicht angezeigt!',
        },
        item: {
          name: 'Bild',
          line: image.name,
        },
      },
    });
  }

  /**
   * Opens the dialog which is used to delete the `Image` from the dialog data.
   *
   * @param tag The `Image` which should get deleted.
   */
  showDeleteImageDialog(image: Image) {
    return this.showDefaultDeleteDialog({
      data: {
        title: 'Bild löschen',
        callout: {
          type: 'WARN',
          message: 'Gelöschte Bilder können nicht wieder hergestellt werden!',
        },
        item: {
          name: 'Bild',
          line: image.name,
        },
      },
    });
  }
}
