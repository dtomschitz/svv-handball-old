import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HotToastModule } from '@ngneat/hot-toast';
import { ErrorTailorModule } from '@svv/error-tailor';
import { AuthModule } from '@svv/cms/auth';
import { CoreModule, AppComponent } from '@svv/cms/core';
import { AppRoutingModule } from './app-routing.module';
import { AppStoreModule } from './app-store.module';

import { registerLocaleData } from '@angular/common';
import localeDe from '@angular/common/locales/de';
registerLocaleData(localeDe);

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ErrorTailorModule.forRoot({
      defaultErrors: {
        required: 'Dieses Feld ist erforderlich',
        invalidUrl: 'Die Url ist nicht valide',
        duplicate: 'Name bereits vergeben',
        email: 'E-Mail nicht korrekt',
      },
    }),
    HotToastModule.forRoot({
      position: 'top-right',
    }),
    AppStoreModule,
    CoreModule,
    AuthModule,
    AppRoutingModule,
  ],
  providers: [{ provide: LOCALE_ID, useValue: 'de' }],
  bootstrap: [AppComponent],
})
export class AppModule {}
