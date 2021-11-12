import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ImageModalModule } from '@svv/common-components/image-modal';
import { LazyImageModule } from '@svv/common-components/lazy-image';
import { ShimmerPlaceholderModule } from '@svv/common-components/shimmer-placeholder';
import { MaterialModule } from '@svv/website/shared/material';
import { OrgaContactComponent, OrgaImageContactComponent } from './components';
import { OrgaRoutingModule } from './orga-routing.module';
import { OrgaComponent } from './orga.component';

@NgModule({
  imports: [
    CommonModule,
    ImageModalModule,
    ShimmerPlaceholderModule,
    LazyImageModule,
    MaterialModule,
    OrgaRoutingModule,
  ],
  declarations: [
    OrgaComponent,
    OrgaContactComponent,
    OrgaImageContactComponent,
  ],
})
export class OrgaModule {}
