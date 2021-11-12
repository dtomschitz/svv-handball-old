import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatChipOptionsComponent } from './mat-chip-options.component';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

@NgModule({
  imports: [CommonModule, MatChipsModule, MatIconModule],
  declarations: [MatChipOptionsComponent],
  exports: [MatChipOptionsComponent],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: MatChipOptionsComponent,
      multi: true,
    },
  ],
})
export class MatChipOptionsModule {}
