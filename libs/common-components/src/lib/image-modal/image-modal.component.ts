import { Component, ChangeDetectionStrategy, Inject } from '@angular/core';
import { ImageModalOverlayRef } from './image-modal-overlay-ref';
import { IMAGE_MODAL_DIALOG_DATA } from './image-modal.tokens';
import { ImageModalData } from './image-modal.types';

@Component({
  selector: 'image-modal',
  templateUrl: './image-modal.component.html',
  styleUrls: ['./image-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImageModalComponent {
  constructor(
    private dialogRef: ImageModalOverlayRef,
    @Inject(IMAGE_MODAL_DIALOG_DATA) public image: ImageModalData,
  ) {}

  close() {
    this.dialogRef.close();
  }
}
