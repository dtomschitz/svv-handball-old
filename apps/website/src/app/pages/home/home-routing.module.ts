import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HomeComponent } from './home.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: HomeComponent,
        pathMatch: 'full',
      },
    ]),
  ],
  exports: [RouterModule],
})
export class HomeRoutingModule {}
