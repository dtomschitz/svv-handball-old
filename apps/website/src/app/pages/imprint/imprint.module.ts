import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MaterialModule } from '@svv/website/shared/material';
import { ImprintRoutingModule } from './imprint-routing.module';
import { ImprintComponent } from './imprint.component';

@NgModule({
  imports: [CommonModule, ImprintRoutingModule, MaterialModule],
  declarations: [ImprintComponent],
})
export class ImprintModule {}
