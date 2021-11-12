import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ReactiveComponentModule } from '@ngrx/component';
import { DialogModule } from '@svv/common-components/dialog';
import { CalloutModule } from '@svv/common-components/callout';
import { MaterialModule } from '@svv/cms/material';
import { SharedModule } from '@svv/cms/shared';
import { HttpErrorInterceptor } from '@svv/cms/core/services';
import { AppComponent } from './containers';
import {
  ConfirmationDialog,
  ToolbarComponent,
  NavItemComponent,
  FeatureBarComponent,
} from './components';

@NgModule({
  declarations: [
    AppComponent,
    ConfirmationDialog,
    ToolbarComponent,
    NavItemComponent,
    FeatureBarComponent,
  ],
  imports: [
    CommonModule,
    ReactiveComponentModule,
    CalloutModule,
    DialogModule,
    MaterialModule,
    SharedModule,
    RouterModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpErrorInterceptor,
      multi: true,
    },
  ],
})
export class CoreModule {}
