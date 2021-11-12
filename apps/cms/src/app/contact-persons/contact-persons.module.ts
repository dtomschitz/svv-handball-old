import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ReactiveComponentModule } from '@ngrx/component';
import { CalloutModule } from '@svv/common-components/callout';
import { DialogModule } from '@svv/common-components/dialog';
import { ErrorTailorModule } from '@svv/error-tailor';
import { SharedModule } from '@svv/cms/shared';
import { MaterialModule } from '@svv/cms/material';
import {
  ContactPersonCategoriesComponent,
  ContactPersonsComponent,
} from './containers';
import {
  CreateOrEditContactPersonCategoryDialog,
  CreateOrEditContactPersonDialog,
  SortContactPersonCategoriesDialog,
  SortContactPersonsDialog,
} from './components';
import {
  ContactPersonsService,
  ContactPersonsDialogService,
  ContactPersonCategoriesService,
  ContactPersonCategoriesDialogService,
} from './services';
import { ContactPersonsRoutingModule } from './contact-persons-routing.module';
import { ContactPersonsStoreModule } from './contact-persons-store.module';

@NgModule({
  declarations: [
    ContactPersonsComponent,
    ContactPersonCategoriesComponent,
    CreateOrEditContactPersonCategoryDialog,
    CreateOrEditContactPersonDialog,
    SortContactPersonCategoriesDialog,
    SortContactPersonsDialog,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ReactiveComponentModule,
    CalloutModule,
    DialogModule,
    SharedModule,
    MaterialModule,
    ErrorTailorModule.forFeature(),
    ContactPersonsRoutingModule,
    ContactPersonsStoreModule,
  ],
  providers: [
    ContactPersonsService,
    ContactPersonCategoriesService,
    ContactPersonsDialogService,
    ContactPersonCategoriesDialogService,
  ],
})
export class ContactPersonsModule {}
