import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { SponsorsService } from './services';
import { SponsorEffects, SponsorsEffects } from './store/effects';
import * as fromSponsors from '@svv/cms/sponsors/store/reducers';

@NgModule({
  imports: [
    StoreModule.forFeature(fromSponsors.featureKey, fromSponsors.reducer),
    EffectsModule.forFeature([SponsorEffects, SponsorsEffects]),
  ],
  providers: [SponsorsService],
})
export class SponsorsStoreModule {}
