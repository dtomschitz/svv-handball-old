import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { select, Store } from '@ngrx/store';
import { ImageTag } from '@svv/core/models';
import { DialogMode } from '@svv/cms/core/models';
import { CustomValidators } from '@svv/cms/shared/validators';
import * as fromImages from '@svv/cms/images/store/reducers';

export interface CreateOrEditTagDialogData {
  mode: DialogMode;
  tag?: ImageTag;
}

@Component({
  selector: 'create-or-edit-tag-dialog',
  templateUrl: './create-or-edit-tag-dialog.component.html',
  styleUrls: ['./create-or-edit-tag-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateOrEditTagDialog {
  tagForm: FormGroup;

  constructor(
    private store: Store<fromImages.State>,
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<CreateOrEditTagDialog>,
    @Inject(MAT_DIALOG_DATA) private data: CreateOrEditTagDialogData,
  ) {
    this.tagForm = this.formBuilder.group({
      name: [
        data?.tag?.name,
        Validators.required,
        CustomValidators.duplicateValueValidator(
          this.store.pipe(select(fromImages.selectAllImageTagNames)),
          data?.tag?.name,
        ),
      ],
      isSeasonTag: [data?.tag?.isSeasonTag],
    });
  }

  close() {
    this.dialogRef.close();
  }

  get invalidOrNotDirty() {
    return this.tagForm.invalid || !this.tagForm.dirty;
  }

  get isCreateDialog() {
    return this.data.mode === DialogMode.CREATE;
  }
}
