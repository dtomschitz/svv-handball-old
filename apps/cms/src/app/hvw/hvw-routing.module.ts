import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import {
  ClassesComponent,
  GamesComponent,
  JobsComponent,
  TablesComponent,
  WeeksComponent,
} from './containers';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        redirectTo: 'games',
      },
      {
        path: 'games',
        component: GamesComponent,
        data: {
          currentTab: 0,
        },
      },
      {
        path: 'classes',
        component: ClassesComponent,
        data: {
          currentTab: 1,
        },
      },
      {
        path: 'weeks',
        component: WeeksComponent,
        data: {
          currentTab: 2,
        },
      },
      {
        path: 'tables',
        component: TablesComponent,
        data: {
          currentTab: 3,
        },
      },
      {
        path: 'jobs',
        component: JobsComponent,
        data: {
          currentTab: 4,
        },
      },
    ]),
  ],
  exports: [RouterModule],
})
export class HvwRoutingModule {}
