import { APP_INITIALIZER, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterService } from '@datorama/akita-ng-router-store';
import { LazyImageModule } from '@svv/common-components/lazy-image';
import { ShimmerPlaceholderModule } from '@svv/common-components/shimmer-placeholder';
import { MaterialModule } from '@svv/website/shared/material';
import { DirectivesModule } from '@svv/website/shared/directives';
import { AppComponent, PageNotFoundComponent } from './containers';
import {
  FooterComponent,
  SidenavComponent,
  SidenavButtonComponent,
  SidenavSectionComponent,
  SidenavSectionHeadingComponent,
  SidenavRightComponent,
  SidenavLeftComponent,
  AmazonSmileComponent,
  DesktopFooterComponent,
} from './components';
import {
  HttpContextService,
  HttpErrorInterceptor,
  SeoService,
  LayoutService,
} from './services';

@NgModule({
  declarations: [
    AppComponent,
    PageNotFoundComponent,
    AmazonSmileComponent,
    DesktopFooterComponent,
    FooterComponent,
    SidenavComponent,
    SidenavLeftComponent,
    SidenavRightComponent,
    SidenavButtonComponent,
    SidenavSectionComponent,
    SidenavSectionHeadingComponent,
    PageNotFoundComponent,
  ],
  imports: [
    CommonModule,
    LazyImageModule,
    ShimmerPlaceholderModule,
    RouterModule,
    DirectivesModule,
    MaterialModule,
  ],
  providers: [
    HttpContextService,
    RouterService,
    SeoService,
    LayoutService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpErrorInterceptor,
      multi: true,
    },
  ],
  exports: [AppComponent, PageNotFoundComponent],
})
export class CoreModule {}
