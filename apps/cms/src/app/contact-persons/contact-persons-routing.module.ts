import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import {
  ContactPersonsComponent,
  ContactPersonCategoriesComponent,
} from './containers';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        redirectTo: 'overview',
      },
      {
        path: 'overview',
        component: ContactPersonsComponent,
        data: {
          currentTab: 0,
        },
      },
      {
        path: 'categories',
        component: ContactPersonCategoriesComponent,
        data: {
          currentTab: 1,
        },
      },
    ]),
  ],
  exports: [RouterModule],
})
export class ContactPersonsRoutingModule {}
