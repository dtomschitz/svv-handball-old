import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { ImagesService, ImageTagsService } from './services';
import {
  ImageEffects,
  ImagesEffects,
  ImageTagEffects,
  ImageTagsEffects,
} from './store/effects';
import * as fromImages from '@svv/cms/images/store/reducers';

@NgModule({
  imports: [
    StoreModule.forFeature(fromImages.featureKey, fromImages.reducers),
    EffectsModule.forFeature([
      ImageEffects,
      ImagesEffects,
      ImageTagEffects,
      ImageTagsEffects,
    ]),
  ],
  providers: [ImagesService, ImageTagsService],
})
export class ImagesStoreModule {}
