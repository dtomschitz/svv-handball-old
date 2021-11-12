import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ImageModalComponent } from './image-modal.component';
import { ImageModalService } from './image-modal.service';

@NgModule({
  imports: [CommonModule, MatButtonModule, MatIconModule],
  declarations: [ImageModalComponent],
  exports: [ImageModalComponent],
  providers: [ImageModalService],
})
export class ImageModalModule {}
