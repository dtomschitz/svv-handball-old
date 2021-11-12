import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

import {
  DialogActionsComponent,
  DialogBodyComponent,
  DialogComponent,
  DialogTitleComponent,
} from './dialog.component';

@NgModule({
  imports: [CommonModule, MatButtonModule, MatIconModule],
  declarations: [
    DialogActionsComponent,
    DialogBodyComponent,
    DialogComponent,
    DialogTitleComponent,
  ],
  exports: [
    DialogActionsComponent,
    DialogBodyComponent,
    DialogComponent,
    DialogTitleComponent,
  ],
})
export class DialogModule {}
