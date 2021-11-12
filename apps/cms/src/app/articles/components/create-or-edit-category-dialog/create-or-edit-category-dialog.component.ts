import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { select, Store } from '@ngrx/store';
import { ArticleCategory } from '@svv/core/models';
import { DialogMode } from '@svv/cms/core/models/dialog-mode.model';
import { CustomValidators } from '@svv/cms/shared/validators';
import * as fromArticle from '@svv/cms/articles/store/reducers';

export interface CreateOrEditCategoryDetailsDialogData {
  mode: DialogMode;
  category?: ArticleCategory;
}

@Component({
  selector: 'create-or-edit-category-dialog',
  templateUrl: './create-or-edit-category-dialog.component.html',
  styleUrls: ['./create-or-edit-category-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateOrEditCategoryDetailsDialog {
  categoryForm: FormGroup;

  constructor(
    private store: Store<fromArticle.State>,
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<CreateOrEditCategoryDetailsDialog>,
    @Inject(MAT_DIALOG_DATA) public data: CreateOrEditCategoryDetailsDialogData,
  ) {
    this.categoryForm = this.formBuilder.group({
      name: [
        data?.category?.name,
        Validators.required,
        CustomValidators.duplicateValueValidator(
          this.store.pipe(select(fromArticle.selectAllCategoryNames)),
          data?.category?.name,
        ),
      ],
      link: [data?.category?.link],
    });
  }

  close() {
    this.dialogRef.close();
  }

  get invalidOrNotDirty() {
    return this.categoryForm.invalid || !this.categoryForm.dirty;
  }

  get isCreateDialog() {
    return this.data.mode === DialogMode.CREATE;
  }
}
