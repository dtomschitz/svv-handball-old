import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ImageModalModule } from '@svv/common-components/image-modal';
import { LazyImageModule } from '@svv/common-components/lazy-image';
import { ShimmerPlaceholderModule } from '@svv/common-components/shimmer-placeholder';
import { CalloutModule } from '@svv/common-components/callout';
import { MaterialModule } from '@svv/website/shared/material';
import { DirectivesModule } from '@svv/website/shared/directives';
import { PipesModule } from '@svv/website/shared/pipes';
import {
  ContactPersonComponent,
  OrganizationChartComponent,
} from './components';
import { ContactPersonsComponent } from './contact-persons.component';
import { ContactPersonsRoutingModule } from './contact-persons-routing.module';

@NgModule({
  imports: [
    CommonModule,
    ImageModalModule,
    LazyImageModule,
    ShimmerPlaceholderModule,
    CalloutModule,
    DirectivesModule,
    PipesModule,
    MaterialModule,
    ContactPersonsRoutingModule,
  ],
  declarations: [
    ContactPersonsComponent,
    ContactPersonComponent,
    OrganizationChartComponent,
  ],
})
export class ContactPersonsModule {}
