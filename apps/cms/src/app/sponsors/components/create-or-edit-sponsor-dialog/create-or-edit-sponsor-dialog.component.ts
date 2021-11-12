import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { select, Store } from '@ngrx/store';
import { Sponsor } from '@svv/core/models';
import { DialogMode } from '@svv/cms/core/models';
import { CustomValidators } from '@svv/cms/shared/validators';
import * as fromSponsors from '@svv/cms/sponsors/store/reducers';

export interface CreateOrEditSponsorDialogData {
  mode: DialogMode;
  sponsor?: Sponsor;
}

/**
 * This component is used as an dialog for creating or modifying a `Sponsor`.
 */
@Component({
  selector: 'create-or-edit-sponsor-dialog',
  templateUrl: './create-or-edit-sponsor-dialog.component.html',
  styleUrls: ['./create-or-edit-sponsor-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateOrEditSponsorDialog {
  sponsorForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<CreateOrEditSponsorDialog>,
    private store: Store<fromSponsors.State>,
    @Inject(MAT_DIALOG_DATA) private data: CreateOrEditSponsorDialogData,
  ) {
    this.sponsorForm = this.formBuilder.group({
      name: [
        data?.sponsor?.name,
        Validators.required,
        CustomValidators.duplicateValueValidator(
          this.store.pipe(select(fromSponsors.selectAllSponsorNames)),
        ),
      ],
      link: [
        data?.sponsor?.link,
        [Validators.required, CustomValidators.urlValidator],
      ],
    });
  }

  /**
   * Closes the dialog without the changes.
   */
  close() {
    this.dialogRef.close();
  }

  get invalidOrNotDirty() {
    return this.sponsorForm.invalid || !this.sponsorForm.dirty;
  }

  get isCreateDialog() {
    return this.data.mode === DialogMode.CREATE;
  }
}
