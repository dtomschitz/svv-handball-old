import { Injectable, Injector } from '@angular/core';
import { DialogService } from '@svv/cms/core/services';
import { ImageTag } from '@svv/core/models';
import {
  CreateOrEditTagDialog,
  CreateOrEditTagDialogData,
} from '@svv/cms/images/components';

@Injectable()
export class ImageTagsDialogService extends DialogService {
  constructor(injector: Injector) {
    super(injector);
  }

  /**
   * Opens the dialog which is used to either modify or create a `Image Tag`.
   */
  showCreateOrEditImageTagDialog(data: CreateOrEditTagDialogData) {
    return this.showDialog<
      CreateOrEditTagDialog,
      CreateOrEditTagDialogData,
      Partial<ImageTag>
    >(CreateOrEditTagDialog, {
      width: '312px',
      data,
    });
  }

  /**
   * Opens the dialog which is used to delete the `Image Tag` from the dialog data.
   *
   * @param tag The `Image Tag` which should get deleted.
   */
  showDeleteImageTagDialog(tag: ImageTag) {
    return this.showDefaultDeleteDialog({
      data: {
        title: 'Tag löschen',
        callout: {
          type: 'WARN',
          message:
            'Das Löschen eines Tags kann nicht rückgängig gemacht werden!',
        },
        item: {
          name: 'Tag',
          line: tag.name,
        },
      },
    });
  }
}
