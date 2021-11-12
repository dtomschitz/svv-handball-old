import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ReactiveComponentModule } from '@ngrx/component';
import { CalloutModule } from '@svv/common-components/callout';
import { DialogModule } from '@svv/common-components/dialog';
import { ShimmerPlaceholderModule } from '@svv/common-components/shimmer-placeholder';
import { ErrorTailorModule } from '@svv/error-tailor';
import { MaterialModule } from '@svv/cms/material';
import { SharedModule } from '@svv/cms/shared';
import {
  ImagesComponent,
  SponsorImagesComponent,
  TagsComponent,
  TeamImagesComponent,
} from './containers';
import {
  CreateOrEditImageDialog,
  CreateOrEditTagDialog,
  ImageDetailsComponent,
} from './components';
import { ImagesDialogService, ImageTagsDialogService } from './services';
import { ImagesRoutingModule } from './images-routing.module';
import { ImagesStoreModule } from './images-store.module';

@NgModule({
  declarations: [
    ImagesComponent,
    SponsorImagesComponent,
    TagsComponent,
    TeamImagesComponent,
    CreateOrEditImageDialog,
    CreateOrEditTagDialog,
    ImageDetailsComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ReactiveComponentModule,
    CalloutModule,
    DialogModule,
    ShimmerPlaceholderModule,
    ErrorTailorModule.forFeature({
      groupErrors: [
        {
          selector: ['createOrEditTag'],
          controls: [
            {
              selector: 'name',
              errors: {
                duplicate: 'Name bereits vergeben',
              },
            },
          ],
        },
      ],
    }),
    MaterialModule,
    SharedModule,
    ImagesRoutingModule,
    ImagesStoreModule,
  ],
  exports: [ImagesComponent],
  providers: [ImageTagsDialogService, ImagesDialogService],
})
export class ImagesModule {}
