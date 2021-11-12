import { OverlayRef } from '@angular/cdk/overlay';

export class ImageModalOverlayRef {
  constructor(private overlayRef: OverlayRef) {}

  close() {
    this.overlayRef.dispose();
  }
}
