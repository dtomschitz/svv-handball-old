import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MaterialModule } from '@svv/website/shared/material';
import { DownloadsRoutingModule } from './downloads-routing.module';
import { DownloadsComponent } from './downloads.component';

@NgModule({
  imports: [CommonModule, DownloadsRoutingModule, MaterialModule],
  declarations: [DownloadsComponent],
})
export class DownloadsModule {}
