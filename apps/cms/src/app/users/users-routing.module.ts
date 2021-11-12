import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AdminsComponent, AuthorsComponent, CoachesComponent } from './containers';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        redirectTo: 'admins',
      },
      {
        path: 'admins',
        component: AdminsComponent,
        data: {
          currentTab: 0,
        },
      },
      {
        path: 'authors',
        component: AuthorsComponent,
        data: {
          currentTab: 1,
        },
      },
      {
        path: 'coaches',
        component: CoachesComponent,
        data: {
          currentTab: 2,
        },
      },
    ]),
  ],
  exports: [RouterModule],
})
export class UsersRoutingModule {}
