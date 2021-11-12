import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { CalloutComponent } from './callout.component';

@NgModule({
  imports: [CommonModule, MatIconModule],
  declarations: [CalloutComponent],
  exports: [CalloutComponent],
})
export class CalloutModule {}
