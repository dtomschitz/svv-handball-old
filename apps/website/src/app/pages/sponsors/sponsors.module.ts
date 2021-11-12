import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CalloutModule } from '@svv/common-components/callout';
import { DirectivesModule } from '@svv/website/shared/directives';
import { MaterialModule } from '@svv/website/shared/material';
import { SponsorComponent, SponsorsContactComponent } from './components';
import { SponsorsRoutingModule } from './sponsors-routing.module';
import { SponsorsComponent } from './sponsors.component';

@NgModule({
  imports: [
    CommonModule,
    CalloutModule,
    DirectivesModule,
    MaterialModule,
    SponsorsRoutingModule,
  ],
  declarations: [SponsorsComponent, SponsorComponent, SponsorsContactComponent],
})
export class SponsorsModule {}
