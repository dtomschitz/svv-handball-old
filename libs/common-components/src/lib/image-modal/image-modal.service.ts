import { Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal, PortalInjector } from '@angular/cdk/portal';
import { ComponentRef, Injectable, Injector, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { IMAGE_MODAL_DIALOG_DATA } from './image-modal.tokens';
import { ImageModalConfig } from './image-modal.types';
import { ImageModalOverlayRef } from './image-modal-overlay-ref';
import { ImageModalComponent } from './image-modal.component';

const DEFAULT_CONFIG: ImageModalConfig = {
  hasBackdrop: true,
  backdropClass: 'dark-backdrop',
  panelClass: 'image-modal-panel',
};

@Injectable()
export class ImageModalService implements OnDestroy {
  private readonly destroy$: Subject<void> = new Subject<void>();

  constructor(private injector: Injector, private overlay: Overlay) {}

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  openImageModal(config?: ImageModalConfig) {
    const dialogConfig = { ...DEFAULT_CONFIG, ...config };
    const overlayRef = this.createOverlay(dialogConfig);

    const dialogRef = new ImageModalOverlayRef(overlayRef);
    const overlayComponent = this.attachDialogContainer(
      overlayRef,
      dialogConfig,
      dialogRef,
    );

    overlayRef
      .backdropClick()
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => dialogRef.close());

    return dialogRef;
  }

  private createOverlay(config: ImageModalConfig) {
    const overlayConfig = this.getOverlayConfig(config);
    return this.overlay.create(overlayConfig);
  }

  private createInjector(
    config: ImageModalConfig,
    dialogRef: ImageModalOverlayRef,
  ): PortalInjector {
    const injectionTokens = new WeakMap();
    injectionTokens.set(ImageModalOverlayRef, dialogRef);
    injectionTokens.set(IMAGE_MODAL_DIALOG_DATA, config.data);

    return new PortalInjector(this.injector, injectionTokens);
  }

  private attachDialogContainer(
    overlayRef: OverlayRef,
    config: ImageModalConfig,
    dialogRef: ImageModalOverlayRef,
  ) {
    const injector = this.createInjector(config, dialogRef);
    const containerPortal = new ComponentPortal(
      ImageModalComponent,
      null,
      injector,
    );
    const containerRef: ComponentRef<ImageModalComponent> =
      overlayRef.attach(containerPortal);

    return containerRef.instance;
  }

  private getOverlayConfig(config: ImageModalConfig): OverlayConfig {
    const positionStrategy = this.overlay
      .position()
      .global()
      .centerHorizontally()
      .centerVertically();

    const overlayConfig = new OverlayConfig({
      // width: '100%',
      // height: '100%',
      hasBackdrop: config.hasBackdrop,
      backdropClass: config.backdropClass,
      panelClass: config.panelClass,
      scrollStrategy: this.overlay.scrollStrategies.block(),
      positionStrategy,
    });

    return overlayConfig;
  }
}
