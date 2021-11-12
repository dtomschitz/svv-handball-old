import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import {
  HvwClassesService,
  HvwGamesService,
  HvwJobsService,
  HvwTablesService,
  HvwWeeksService,
  HvwService,
} from './services';
import {
  GamesEffects,
  ClassesEffects,
  WeeksEffects,
  TablesEffects,
  JobsEffects,
  JobEffects,
} from './store/effects';
import * as fromHvw from '@svv/cms/hvw/store/reducers';

@NgModule({
  imports: [
    StoreModule.forFeature(fromHvw.featureKey, fromHvw.reducers),
    EffectsModule.forFeature([
      GamesEffects,
      ClassesEffects,
      WeeksEffects,
      TablesEffects,
      JobsEffects,
      JobEffects,
    ]),
  ],
  providers: [
    HvwClassesService,
    HvwGamesService,
    HvwJobsService,
    HvwTablesService,
    HvwWeeksService,
    HvwService,
  ],
})
export class HvwStoreModule {}
