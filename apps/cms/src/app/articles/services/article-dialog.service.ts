import { Injectable, Injector } from '@angular/core';
import { Article } from '@svv/core/models';
import { DialogService } from '@svv/cms/core/services';
import {
  DeleteArticleDialog,
  DeleteArticleDialogData,
  CreateOrEditArticleDetailsDialog,
  CreateOrEditArticleDetailsDialogData,
  ToggleArticleDialogData,
  ToggleArticleDialog,
} from '@svv/cms/articles/components';

/**
 * This dialog service which contains methods for opening every dialog for the
 * `Articles` feature.
 */
@Injectable()
export class ArticleDialogService extends DialogService {
  constructor(injector: Injector) {
    super(injector);
  }

  /**
   * Opens the dialog which is used to either modify or create a `Article`.
   */
  showCreateOrEditArticleDialog(data: CreateOrEditArticleDetailsDialogData) {
    return this.showDialog<
      CreateOrEditArticleDetailsDialog,
      CreateOrEditArticleDetailsDialogData,
      Partial<Article>
    >(CreateOrEditArticleDetailsDialog, {
      height: '912px',
      width: '70%',
      data,
    });
  }

  /**
   * Opens the dialog which is used to enabled or disabled the `Article` from
   * the dialog data.
   *
   * @param data The dialog data which contains the `Article` that should
   * be toggled.
   */
  showToggleArticleDialog(data: ToggleArticleDialogData) {
    return this.showDialog<
      ToggleArticleDialog,
      ToggleArticleDialogData,
      Partial<Article>
    >(ToggleArticleDialog, {
      width: '512px',
      data,
    });
  }

  /**
   * Opens the dialog which is used to delete the `Article` from the dialog data.
   *
   * @param data The dialog data which contains the `Article` that should be deleted.
   */
  showDeleteArticleDialog(data: DeleteArticleDialogData) {
    return this.showDialog<
      DeleteArticleDialog,
      DeleteArticleDialogData,
      boolean
    >(DeleteArticleDialog, {
      width: '512px',
      data,
    });
  }
}
