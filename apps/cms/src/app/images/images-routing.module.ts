import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import {
  SponsorImagesComponent,
  TagsComponent,
  TeamImagesComponent,
} from './containers';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        redirectTo: 'teams',
      },
      {
        path: 'teams',
        component: TeamImagesComponent,
        data: {
          currentTab: 0,
        },
      },
      {
        path: 'sponsors',
        component: SponsorImagesComponent,
        data: {
          currentTab: 1,
        },
      },
      {
        path: 'tags',
        component: TagsComponent,
        data: {
          currentTab: 2,
        },
      },
    ]),
  ],
  exports: [RouterModule],
})
export class ImagesRoutingModule {}
