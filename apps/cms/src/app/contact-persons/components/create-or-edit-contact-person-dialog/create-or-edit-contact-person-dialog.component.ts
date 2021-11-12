import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { select, Store } from '@ngrx/store';
import { ContactPerson, ContactPersonCategory } from '@svv/core/models';
import { DialogMode } from '@svv/cms/core/models';
import { getContactPersonTypes } from '@svv/cms/shared/constants';
import { CustomValidators } from '@svv/cms/shared/validators';
import * as fromContactPersons from '@svv/cms/contact-persons/store/reducers';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

export interface CreateOrEditContactPersonDialogData {
  mode: DialogMode;
  contactPerson?: ContactPerson;
  categories: ContactPersonCategory[];
}

/**
 * This component is used as an dialog for creating or modifying a `Contact Person`.
 */
@Component({
  selector: 'create-or-edit-sponsor-dialog',
  templateUrl: './create-or-edit-contact-person-dialog.component.html',
  styleUrls: ['./create-or-edit-contact-person-dialog.component.html'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateOrEditContactPersonDialog {
  contactPersonForm: FormGroup;
  categorySearchControl: FormControl;

  filteredCategories$: Observable<ContactPersonCategory[]>;
  contactPersonTypes = getContactPersonTypes();

  constructor(
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<CreateOrEditContactPersonDialog>,
    private store: Store<fromContactPersons.State>,
    @Inject(MAT_DIALOG_DATA) private data: CreateOrEditContactPersonDialogData,
  ) {
    this.contactPersonForm = this.formBuilder.group({
      name: [
        data?.contactPerson?.name,
        Validators.required,
        CustomValidators.duplicateValueValidator(
          this.store.pipe(
            select(fromContactPersons.selectAllContactPersonNames),
          ),
          data?.contactPerson?.name,
        ),
      ],
      email: [
        data?.contactPerson?.email,
        [Validators.required, Validators.email],
      ],
      categoryId: [data?.contactPerson?.categoryId, Validators.required],
      people: [data?.contactPerson?.people ?? []],
    });

    this.categorySearchControl = this.formBuilder.control('');

    this.filteredCategories$ = this.categorySearchControl.valueChanges.pipe(
      startWith(null),
      map((value: string | null) =>
        value
          ? this.data.categories.filter(category => {
              return category.name.toLowerCase().includes(value.toLowerCase());
            })
          : this.data.categories.slice(),
      ),
    );
  }

  /**
   * Closes the dialog without the changes.
   */
  close() {
    this.dialogRef.close();
  }

  get invalidOrNotDirty() {
    return this.contactPersonForm.invalid || !this.contactPersonForm.dirty;
  }

  get isCreateDialog() {
    return this.data.mode === DialogMode.CREATE;
  }
}
