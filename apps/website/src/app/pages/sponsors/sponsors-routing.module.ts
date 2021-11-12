import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SponsorsComponent } from './sponsors.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: SponsorsComponent,
        pathMatch: 'full',
      },
    ]),
  ],
  exports: [RouterModule],
})
export class SponsorsRoutingModule {}
