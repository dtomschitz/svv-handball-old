import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreRouterConnectingModule } from '@ngrx/router-store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from '@svv/cms/environments/environment';
import { ROOT_REDUCERS } from '@svv/cms/reducers';
import {
  NotificationEffects,
  RouterEffects,
} from '@svv/cms/core/store/effects';

@NgModule({
  imports: [
    StoreModule.forRoot(ROOT_REDUCERS, {
      runtimeChecks: {
        strictStateSerializability: true,
        strictActionSerializability: false,
        strictActionWithinNgZone: true,
        strictActionTypeUniqueness: true,
      },
    }),
    StoreRouterConnectingModule.forRoot(),
    StoreDevtoolsModule.instrument({
      name: 'SV Vaihingen CMS',
      logOnly: environment.production,
    }),
    EffectsModule.forRoot([RouterEffects, NotificationEffects]),
  ],
})
export class AppStoreModule {}
