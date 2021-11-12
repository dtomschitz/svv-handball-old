import { LOCALE_ID, NgModule } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localDe from '@angular/common/locales/de';
import {
  BrowserModule,
  BrowserTransferStateModule,
} from '@angular/platform-browser';
import { ServiceWorkerModule } from '@angular/service-worker';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { TransferHttpCacheModule } from '@nguniversal/common';
import { MAT_SNACK_BAR_DEFAULT_OPTIONS } from '@angular/material/snack-bar';
import { AkitaNgRouterStoreModule } from '@datorama/akita-ng-router-store';
import { AkitaNgDevtools } from '@datorama/akita-ngdevtools';
import { environment } from '@svv/website/environments/environment';
import { CoreModule } from '@svv/website/core';
import { SwUpdatesModule } from '@svv/website/sw-updates';
import { AppComponent } from '@svv/website/core/containers';
import { AppRoutingModule } from './app-routing.module';

registerLocaleData(localDe, 'de');

@NgModule({
  imports: [
    BrowserModule.withServerTransition({ appId: 'svv-handball' }),
    BrowserTransferStateModule,
    BrowserAnimationsModule,
    HttpClientModule,
    TransferHttpCacheModule,
    SwUpdatesModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
    }),
    AkitaNgRouterStoreModule,
    environment.production ? [] : [AkitaNgDevtools.forRoot()],
    CoreModule,
    AppRoutingModule,
  ],
  providers: [
    {
      provide: LOCALE_ID,
      useValue: 'de',
    },
    {
      provide: MAT_SNACK_BAR_DEFAULT_OPTIONS,
      useValue: { duration: 2500 },
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
