import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

/**
 * This component is used as an dialog for modifying the `Sponsor` image.
 */
@Component({
  selector: 'edit-sponsor-image-dialog',
  templateUrl: './edit-sponsor-image-dialog.component.html',
  styleUrls: ['./edit-sponsor-image-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditSponsorImageDialog {
  image: File;

  constructor(private dialogRef: MatDialogRef<EditSponsorImageDialog, File>) {}

  /**
   * Sets the uploaded file in order to display more informations about the
   * selected image.
   *
   * @param image The selected image.
   */
  onFileDropped(image: File) {
    this.image = image;
  }

  /**
   * Closes the dialog with the selected image in order to initialize the
   * uploading process.
   */
  uploadSponsorImage(image: File) {
    this.dialogRef.close(image);
  }

  /**
   * Closes the dialog with the value `undefined` in order to stop the
   * deletion process.
   */
  close() {
    this.dialogRef.close();
  }
}
