import { APP_INITIALIZER, NgModule } from '@angular/core';
import { Store, StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { AuthService } from './services';
import { AuthActions } from './store/actions';
import { AuthEffects } from './store/effects';
import * as fromAuth from '@svv/cms/auth/store/reducers';

@NgModule({
  imports: [
    StoreModule.forFeature(fromAuth.featureKey, fromAuth.reducer),
    EffectsModule.forFeature([AuthEffects]),
  ],
  providers: [
    AuthService,
    {
      provide: APP_INITIALIZER,
      useFactory: (store: Store<fromAuth.State>) => {
        return () => store.dispatch(AuthActions.loadAuthTokens());
      },
      multi: true,
      deps: [Store],
    },
  ],
})
export class AuthStoreModule {}
