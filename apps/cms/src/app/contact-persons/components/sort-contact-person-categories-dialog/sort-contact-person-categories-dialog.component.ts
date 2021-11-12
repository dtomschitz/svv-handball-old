import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ContactPerson, ContactPersonCategory } from '@svv/core/models';

export interface SortContactPersonCategoriesDialogData {
  categories: ContactPersonCategory[];
}

/**
 * This component is used as an dialog for sorting the `Contact Persons`.
 */
@Component({
  selector: 'sort-contact-person-categories-dialog',
  templateUrl: './sort-contact-person-categories-dialog.component.html',
  styleUrls: ['./sort-contact-person-categories-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SortContactPersonCategoriesDialog {
  categories: ContactPersonCategory[];

  constructor(
    private dialogRef: MatDialogRef<SortContactPersonCategoriesDialog>,
    @Inject(MAT_DIALOG_DATA)
    private data: SortContactPersonCategoriesDialogData,
  ) {
    this.categories = [...this.data.categories];
  }

  /**
   * Updates the sorting of the `Contact Person Categories`.
   *
   * @param event The drag and drop event.
   */
  drop(event: CdkDragDrop<ContactPerson[]>) {
    moveItemInArray(this.categories, event.previousIndex, event.currentIndex);
  }

  /**
   * Closes the dialog with the sorted `Contact Person Categories` in order to
   * initialize the updating process.
   */
  save() {
    this.dialogRef.close(this.categories);
  }

  /**
   * Closes the dialog with the value `undefined` in order to stop the
   * updating process.
   */
  close() {
    this.dialogRef.close();
  }
}
