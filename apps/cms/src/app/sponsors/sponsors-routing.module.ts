import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SponsorsComponent } from './containers';
@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: SponsorsComponent,
      },
    ]),
  ],
  exports: [RouterModule],
})
export class SponsorsRoutingModule {}
