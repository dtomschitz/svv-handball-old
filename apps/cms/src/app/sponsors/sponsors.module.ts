import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ReactiveComponentModule } from '@ngrx/component';
import { CalloutModule } from '@svv/common-components/callout';
import { DialogModule } from '@svv/common-components/dialog';
import { ErrorTailorModule } from '@svv/error-tailor';
import { SharedModule } from '@svv/cms/shared';
import { MaterialModule } from '@svv/cms/material';
import { SponsorsComponent } from './containers';
import {
  CreateOrEditSponsorDialog,
  EditSponsorImageDialog,
  SortSponsorsDialog,
  SponsorDetailsComponent,
} from './components';
import { SponsorsService, SponsorDialogService } from './services';
import { SponsorsRoutingModule } from './sponsors-routing.module';
import { SponsorsStoreModule } from './sponsors-store.module';

@NgModule({
  declarations: [
    SponsorsComponent,
    CreateOrEditSponsorDialog,
    EditSponsorImageDialog,
    SortSponsorsDialog,
    SponsorDetailsComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ReactiveComponentModule,
    CalloutModule,
    DialogModule,
    ErrorTailorModule.forFeature({
      defaultErrors: {
        pattern: 'Es sind nur Zeichen erlaubt',
      },
      groupErrors: [
        {
          selector: 'createOrEditSponsor',
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
    SharedModule,
    MaterialModule,
    SponsorsRoutingModule,
    SponsorsStoreModule,
  ],
  providers: [SponsorsService, SponsorDialogService],
})
export class SponsorsModule {}
