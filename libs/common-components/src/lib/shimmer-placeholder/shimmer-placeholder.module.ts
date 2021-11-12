import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShimmerPlaceholderComponent } from './shimmer-placeholder.component';

@NgModule({
  imports: [CommonModule],
  declarations: [ShimmerPlaceholderComponent],
  exports: [ShimmerPlaceholderComponent],
})
export class ShimmerPlaceholderModule {}
