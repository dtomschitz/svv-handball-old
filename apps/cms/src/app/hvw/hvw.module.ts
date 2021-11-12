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
  GamesComponent,
  ClassesComponent,
  JobsComponent,
  WeeksComponent,
  TablesComponent,
} from './containers';
import {
  CachingResultsComponent,
  CacheClassesDialog,
  CacheGamesDialog,
  CacheTablesDialog,
  CacheWeeksDialog,
  CreateOrEditJobDialog,
} from './components';
import { HvwDialogService } from './services';
import { HvwRoutingModule } from './hvw-routing.module';
import { HvwStoreModule } from './hvw-store.module';

@NgModule({
  declarations: [
    GamesComponent,
    ClassesComponent,
    WeeksComponent,
    TablesComponent,
    JobsComponent,
    CacheGamesDialog,
    CacheClassesDialog,
    CacheWeeksDialog,
    CacheTablesDialog,
    CachingResultsComponent,
    CreateOrEditJobDialog,
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
          selector: ['createOrEditJob'],
          controls: [
            {
              selector: 'name',
              errors: {
                invalidCron: 'Test',
              },
            },
          ],
        },
      ],
    }),
    MaterialModule,
    SharedModule,
    HvwRoutingModule,
    HvwStoreModule,
  ],
  providers: [HvwDialogService],
})
export class HvwModule {}
