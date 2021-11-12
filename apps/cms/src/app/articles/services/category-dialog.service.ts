import { Injectable, Injector } from '@angular/core';
import { ArticleCategory } from '@svv/core/models';
import { DialogService } from '@svv/cms/core/services';
import {
  DeleteCategoryDialog,
  DeleteCategoryDialogData,
  CreateOrEditCategoryDetailsDialog,
  CreateOrEditCategoryDetailsDialogData,
} from '@svv/cms/articles/components';

/**
 * This dialog service which contains methods for opening every dialog for the
 * `Articles` feature.
 */
@Injectable()
export class CategoryDialogService extends DialogService {
  constructor(injector: Injector) {
    super(injector);
  }

  /**
   * Opens the dialog which is used to either modify or create a `Article Category`.
   */
  showCreateOrEditCategoryDialog(data: CreateOrEditCategoryDetailsDialogData) {
    return this.showDialog<
      CreateOrEditCategoryDetailsDialog,
      CreateOrEditCategoryDetailsDialogData,
      Partial<ArticleCategory>
    >(CreateOrEditCategoryDetailsDialog, {
      width: '312px',
      data,
    });
  }

  /**
   * Opens the dialog which is used to delete the `Article Category` from the
   * dialog data.
   *
   * @param data The dialog data which contains the `Article Category` that
   * should be deleted.
   */
  showDeleteCategoryDialog(data: DeleteCategoryDialogData) {
    return this.showDialog<
      DeleteCategoryDialog,
      DeleteCategoryDialogData,
      boolean
    >(DeleteCategoryDialog, {
      width: '512px',
      data,
    });
  }
}
