import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ReactiveComponentModule } from '@ngrx/component';
import { DialogModule } from '@svv/common-components/dialog';
import { ErrorTailorModule } from '@svv/error-tailor';
import { MaterialModule } from '@svv/cms/material';
import { SharedModule } from '@svv/cms/shared';
import { LoginPageComponent, VerifyPageComponent } from './containers';
import { LogoutDialog } from './components';
import { AuthDialogService, AuthInterceptor } from './services';
import { AuthRoutingModule } from './auth-routing.module';
import { AuthStoreModule } from './auth-store.module';

@NgModule({
  declarations: [LoginPageComponent, VerifyPageComponent, LogoutDialog],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ReactiveComponentModule,
    HttpClientModule,
    DialogModule,
    ErrorTailorModule.forFeature({
      groupErrors: [
        {
          selector: ['credentialsForm'],
          controls: [
            {
              selector: 'email',
              errors: {
                email: 'Die E-Mail-Adresse ist nicht valide',
              },
            },
          ],
        },
      ],
    }),
    MaterialModule,
    SharedModule,
    AuthRoutingModule,
    AuthStoreModule,
  ],
  providers: [
    AuthDialogService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
  ],
})
export class AuthModule {}
