import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ImprintComponent } from './imprint.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: ImprintComponent,
      },
    ]),
  ],
  exports: [RouterModule],
})
export class ImprintRoutingModule {}
