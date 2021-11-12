import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { select, Store } from '@ngrx/store';
import { ContactPersonCategory } from '@svv/core/models';
import { DialogMode } from '@svv/cms/core/models';
import { getContactPersonTypes } from '@svv/cms/shared/constants';
import { CustomValidators } from '@svv/cms/shared/validators';
import * as fromContactPersons from '@svv/cms/contact-persons/store/reducers';

export interface CreateOrEditContactPersonCategoryDialogData {
  mode: DialogMode;
  category?: ContactPersonCategory;
}

/**
 * This component is used as an dialog for creating or modifying a `Contact Person`.
 */
@Component({
  selector: 'create-or-edit-sponsor-category-dialog',
  templateUrl: './create-or-edit-contact-person-category-dialog.component.html',
  styleUrls: ['./create-or-edit-contact-person-category-dialog.component.html'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateOrEditContactPersonCategoryDialog {
  categoryForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<CreateOrEditContactPersonCategoryDialog>,
    private store: Store<fromContactPersons.State>,
    @Inject(MAT_DIALOG_DATA)
    private data: CreateOrEditContactPersonCategoryDialogData,
  ) {
    this.categoryForm = this.formBuilder.group({
      name: [
        data?.category?.name,
        Validators.required,
        CustomValidators.duplicateValueValidator(
          this.store.pipe(
            select(fromContactPersons.selectAllContactPersonCategoryNames),
          ),
          data?.category?.name,
        ),
      ],
    });
  }

  /**Pres
   * Closes the dialog without the changes.
   */
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
