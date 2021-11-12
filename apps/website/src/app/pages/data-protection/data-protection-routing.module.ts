import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DataProtectionComponent } from './data-protection.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: DataProtectionComponent,
      },
    ]),
  ],
  exports: [RouterModule],
})
export class DataProtectionRoutingModule {}
