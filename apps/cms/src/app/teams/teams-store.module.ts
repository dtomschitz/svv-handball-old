import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { TeamsService } from './services';
import { TeamEffects, TeamsEffects } from './store/effects';
import * as fromTeams from '@svv/cms/teams/store/reducers';

@NgModule({
  imports: [
    StoreModule.forFeature(fromTeams.featureKey, fromTeams.reducer),
    EffectsModule.forFeature([TeamEffects, TeamsEffects]),
  ],
  providers: [TeamsService],
})
export class TeamsStoreModule {}
