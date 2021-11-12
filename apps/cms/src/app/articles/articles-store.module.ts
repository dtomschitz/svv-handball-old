import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { ArticlesService, CategoriesService } from './services';
import {
  ArticleEffects,
  ArticlesEffects,
  CategoryEffects,
  CategoriesEffects,
} from './store/effects';
import * as fromArticles from '@svv/cms/articles/store/reducers';

@NgModule({
  imports: [
    StoreModule.forFeature(fromArticles.featureKey, fromArticles.reducers),
    EffectsModule.forFeature([
      ArticleEffects,
      ArticlesEffects,
      CategoryEffects,
      CategoriesEffects,
    ]),
  ],
  providers: [ArticlesService, CategoriesService],
})
export class ArticlesStoreModule {}
