import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  Input,
  ViewEncapsulation,
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'lazy-image',
  template: `
    <ng-content *ngIf="!error" select="lazy-image-placeholder"></ng-content>
    <ng-content
      *ngIf="error"
      select="lazy-image-error-placeholder"
    ></ng-content>
    <ng-container *ngIf="lazyImage && !error">
      <img
        class="lazy-image"
        [src]="lazyImage"
        [alt]="altText"
        (error)="onImgError()"
        loading="lazy"
      />
    </ng-container>
  `,
  styleUrls: ['./lazy-image.component.scss'],
  host: {
    class: 'lazy-image-component',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class LazyImageComponent {
  @Input() lazyImage: string;
  @Input() imageRatio: number;
  @Input() altText: string;

  @HostBinding('style')
  get placeHolderStyle() {
    const imageRatio = 100 / this.imageRatio;
    if (imageRatio !== 100) {
      return this.sanitizer.bypassSecurityTrustStyle(
        `padding-top: ${100 / this.imageRatio}%;`,
      );
    }
  }

  error: boolean;

  constructor(private sanitizer: DomSanitizer) {}

  onImgError() {
    this.error = true;
  }
}

@Component({
  selector: 'lazy-image-placeholder',
  template: ` <ng-content></ng-content> `,
  styleUrls: ['./lazy-image.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class LazyImagePlaceholderComponent {
  @HostBinding('class') class = 'lazy-image-placeholder';
}

@Component({
  selector: 'lazy-image-error-placeholder',
  template: ` <ng-content></ng-content> `,
  styleUrls: ['./lazy-image.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class LazyImageErrorPlaceholderComponent {
  @HostBinding('class') class = 'lazy-image-error-placeholder';
}
