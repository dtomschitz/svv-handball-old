import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Article } from '@svv/core/models';

export interface ToggleArticleDialogData {
  article: Article;
}

/**
 * This component is used as an dialog for enabling or disabling the given `Article`.
 */
@Component({
  selector: 'toggle-article-dialog',
  templateUrl: './toggle-article-dialog.component.html',
  styleUrls: ['./toggle-article-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToggleArticleDialog {
  constructor(
    private dialogRef: MatDialogRef<ToggleArticleDialog>,
    @Inject(MAT_DIALOG_DATA) private data: ToggleArticleDialogData,
  ) {}

  /**
   * Closes the dialog with the value `true` in order to initialize the
   * enabling or disabling process.
   */
  toggleArticle() {
    this.dialogRef.close(true);
  }

  /**
   * Closes the dialog with the value `false` in order to stop the
   * deletion process.
   */
  close() {
    this.dialogRef.close(false);
  }

  /**
   * Returns the given `Article` from the dialog data.
   *
   * @returns The selected `Article`.
   */
  get article() {
    return this.data.article;
  }
}
