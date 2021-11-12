import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  OnInit,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';
import { HvwJob } from '@svv/core/models';
import { CustomValidators } from '@svv/cms/shared/validators';
import { getCachingTypes, getCronExpressions } from '@svv/cms/shared/constants';
import { DialogMode } from '@svv/cms/core/models/dialog-mode.model';
import * as fromHvw from '@svv/cms/hvw/store/reducers';

export interface CreateOrEditJobDialogData {
  mode: DialogMode;
  job?: HvwJob;
}

/**
 * This component is used as an dialog for creating or modifying a `CronJob`.
 */
@Component({
  selector: 'create-or-edit-job-dialog',
  templateUrl: './create-or-edit-job-dialog.component.html',
  styleUrls: ['./create-or-edit-job-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateOrEditJobDialog implements OnInit {
  jobForm: FormGroup;

  cachingOptions = getCachingTypes();
  cronOptions = getCronExpressions();
  filteredCronOptions$: Observable<{ key: string; text: string }[]>;

  constructor(
    private store: Store<fromHvw.State>,
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<CreateOrEditJobDialog>,
    @Inject(MAT_DIALOG_DATA) private data: CreateOrEditJobDialogData,
  ) {
    this.jobForm = this.formBuilder.group({
      name: [
        data.job?.name,
        Validators.required,
        CustomValidators.duplicateValueValidator(
          this.store.pipe(select(fromHvw.selectJobNames)),
          data.job?.name,
        ),
      ],
      cronExpression: [
        data.job?.cronExpression,
        [Validators.required, CustomValidators.cronValidator(this.cronOptions)],
      ],
    });

    if (this.isCreateDialog) {
      this.jobForm.addControl(
        'type',
        this.formBuilder.control('', Validators.required),
      );
    }
  }

  ngOnInit() {
    this.filteredCronOptions$ = this.jobForm
      .get('cronExpression')
      .valueChanges.pipe(
        startWith(''),
        map(value => this.filterCronOptions(value)),
      );
  }

  /**
   * Closes the dialog without the changes.
   */
  close() {
    this.dialogRef.close();
  }

  /**
   * Function for filtering the different cron options.
   *
   * @param value The current value of the input field.
   */
  private filterCronOptions(value: string) {
    return this.cronOptions.filter(option =>
      option.text.toLowerCase().includes(value.toLowerCase()),
    );
  }

  get invalidOrNotDirty() {
    return this.jobForm.invalid || !this.jobForm.dirty;
  }

  get isCreateDialog() {
    return this.data.mode === DialogMode.CREATE;
  }
}
