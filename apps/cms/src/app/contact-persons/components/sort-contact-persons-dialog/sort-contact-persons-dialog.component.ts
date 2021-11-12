import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ContactPerson, ContactPersonCategory } from '@svv/core/models';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

export interface SortContactPersonsDialogData {
  contactPersons: ContactPerson[];
  categories: ContactPersonCategory[];
}

/**
 * This component is used as an dialog for sorting the `Contact Persons`.
 */
@Component({
  selector: 'sort-contact-persons-dialog',
  templateUrl: './sort-contact-persons-dialog.component.html',
  styleUrls: ['./sort-contact-persons-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SortContactPersonsDialog implements OnDestroy {
  private readonly destroy$: Subject<void> = new Subject<void>();

  categoryFormControl: FormControl;

  contactPersons = new BehaviorSubject<ContactPerson[]>([]);
  contactPersons$ = this.contactPersons.asObservable();

  constructor(
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<SortContactPersonsDialog>,
    @Inject(MAT_DIALOG_DATA) private data: SortContactPersonsDialogData,
  ) {
    this.categoryFormControl = this.formBuilder.control(
      this.data.categories[0]._id ?? '',
    );

    this.categoryFormControl.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(categoryId => {
        this.contactPersons.next(
          this.data.contactPersons.filter(
            contactPerson => contactPerson.categoryId === categoryId,
          ),
        );
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Updates the sorting of the `Contact Persons`.
   *
   * @param event The drag and drop event.
   */
  drop(event: CdkDragDrop<ContactPerson[]>) {
    const list = this.contactPersons.getValue();
    moveItemInArray(list, event.previousIndex, event.currentIndex);

    this.contactPersons.next(list);
  }

  /**
   * Closes the dialog with the sorted `Contact Persons` in order to initialize
   * the updating process.
   */
  save() {
    this.dialogRef.close(this.contactPersons.getValue());
  }

  /**
   * Closes the dialog with the value `undefined` in order to stop the
   * updating process.
   */
  close() {
    this.dialogRef.close();
  }

  get categories() {
    return this.data.categories;
  }
}
