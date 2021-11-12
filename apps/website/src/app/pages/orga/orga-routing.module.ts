import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { OrgaComponent } from './orga.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: OrgaComponent,
      },
    ]),
  ],
  exports: [RouterModule],
})
export class OrgaRoutingModule {}
