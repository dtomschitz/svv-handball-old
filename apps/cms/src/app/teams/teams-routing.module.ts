import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import {
  ActiveTeamsComponent,
  TeamImagesComponent,
  YouthTeamsComponent,
} from './containers';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        redirectTo: 'active',
      },
      {
        path: 'active',
        component: ActiveTeamsComponent,
        data: {
          currentTab: 0,
        },
      },
      {
        path: 'youth',
        component: YouthTeamsComponent,
        data: {
          currentTab: 1,
        },
      },
      {
        path: 'images',
        component: TeamImagesComponent,
        data: {
          currentTab: 2,
        },
      },
    ]),
  ],
  exports: [RouterModule],
})
export class TeamsRoutingModule {}
