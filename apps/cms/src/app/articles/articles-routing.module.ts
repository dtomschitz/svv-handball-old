import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import {
  AllArticlesComponent,
  CategoriesComponent,
  PinnedArticlesComponent,
} from './containers';
@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        redirectTo: 'pinned',
      },
      {
        path: 'pinned',
        component: PinnedArticlesComponent,
        data: {
          currentTab: 0,
        },
      },
      {
        path: 'any',
        component: AllArticlesComponent,
        data: {
          currentTab: 1,
        },
      },
      {
        path: 'categories',
        component: CategoriesComponent,
        data: {
          currentTab: 2,
        },
      },
    ]),
  ],
  exports: [RouterModule],
})
export class ArticlesRoutingModule {}
