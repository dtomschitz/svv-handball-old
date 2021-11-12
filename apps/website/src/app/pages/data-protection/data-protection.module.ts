import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MaterialModule } from '@svv/website/shared/material';
import { DataProtectionRoutingModule } from './data-protection-routing.module';
import { DataProtectionComponent } from './data-protection.component';

@NgModule({
  imports: [CommonModule, DataProtectionRoutingModule, MaterialModule],
  declarations: [DataProtectionComponent],
})
export class DataProtectionModule {}
