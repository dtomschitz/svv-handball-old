import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  LazyImageComponent,
  LazyImageErrorPlaceholderComponent,
  LazyImagePlaceholderComponent,
} from './lazy-image.component';

@NgModule({
  imports: [CommonModule],
  declarations: [
    LazyImageComponent,
    LazyImagePlaceholderComponent,
    LazyImageErrorPlaceholderComponent,
  ],
  exports: [
    LazyImageComponent,
    LazyImagePlaceholderComponent,
    LazyImageErrorPlaceholderComponent,
  ],
})
export class LazyImageModule {}
