import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { ContactPersonsService } from './services';
import {
  ContactPersonCategoriesEffects,
  ContactPersonCategoryEffects,
  ContactPersonEffects,
  ContactPersonsEffects,
} from './store/effects';
import * as fromContactPersons from '@svv/cms/contact-persons/store/reducers';

@NgModule({
  imports: [
    StoreModule.forFeature(
      fromContactPersons.featureKey,
      fromContactPersons.reducers,
    ),
    EffectsModule.forFeature([
      ContactPersonEffects,
      ContactPersonsEffects,
      ContactPersonCategoriesEffects,
      ContactPersonCategoryEffects,
    ]),
  ],
  providers: [ContactPersonsService],
})
export class ContactPersonsStoreModule {}
