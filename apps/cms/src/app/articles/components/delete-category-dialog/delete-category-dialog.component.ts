import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ArticleCategory } from '@svv/core/models';

export interface DeleteCategoryDialogData {
  category: ArticleCategory;
}

@Component({
  selector: 'delete-category-dialog',
  templateUrl: './delete-category-dialog.component.html',
  styleUrls: ['./delete-category-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeleteCategoryDialog {
  constructor(
    private dialogRef: MatDialogRef<DeleteCategoryDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DeleteCategoryDialogData,
  ) {}

  deleteCategory() {
    this.dialogRef.close(true);
  }

  close() {
    this.dialogRef.close(false);
  }
}
