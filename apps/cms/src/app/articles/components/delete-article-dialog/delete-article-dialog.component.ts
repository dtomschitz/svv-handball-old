import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Article } from '@svv/core/models';

export interface DeleteArticleDialogData {
  article: Article;
}

@Component({
  selector: 'delete-article-dialog',
  templateUrl: './delete-article-dialog.component.html',
  styleUrls: ['./delete-article-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeleteArticleDialog {
  constructor(
    private dialogRef: MatDialogRef<DeleteArticleDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DeleteArticleDialogData,
  ) {}

  deleteArticle() {
    this.dialogRef.close(true);
  }

  close() {
    this.dialogRef.close(false);
  }
}
