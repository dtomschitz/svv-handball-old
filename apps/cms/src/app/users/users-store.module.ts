import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { UsersService } from './services';
import { UserEffects, UsersEffects } from './store/effects';
import * as fromUsers from '@svv/cms/users/store/reducers';

@NgModule({
  imports: [
    StoreModule.forFeature(fromUsers.featureKey, fromUsers.reducer),
    EffectsModule.forFeature([UserEffects, UsersEffects]),
  ],
  providers: [UsersService],
})
export class UsersStoreModule {}
