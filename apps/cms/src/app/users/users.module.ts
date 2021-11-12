import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ReactiveComponentModule } from '@ngrx/component';
import { CalloutModule } from '@svv/common-components/callout';
import { DialogModule } from '@svv/common-components/dialog';
import { ErrorTailorModule } from '@svv/error-tailor';
import { MaterialModule } from '@svv/cms/material';
import { SharedModule } from '@svv/cms/shared';
import {
  UsersComponent,
  AdminsComponent,
  AuthorsComponent,
  CoachesComponent,
} from './containers';
import {
  CreateOrEditUserDialog,
  ToggleUserDialog,
  EditUserPasswordDialog,
} from './components';
import { UserDialogService } from './services';
import { UsersStoreModule } from './users-store.module';
import { UsersRoutingModule } from './users-routing.module';

@NgModule({
  declarations: [
    UsersComponent,
    AdminsComponent,
    AuthorsComponent,
    CoachesComponent,
    CreateOrEditUserDialog,
    ToggleUserDialog,
    EditUserPasswordDialog,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ReactiveComponentModule,
    CalloutModule,
    DialogModule,
    ErrorTailorModule.forFeature({
      groupErrors: [
        {
          selector: ['createOrEditUser', 'toggleUser'],
          controls: [
            {
              selector: ['firstName', 'lastName'],
              errors: {
                pattern: 'Es sind nur Zeichen erlaubt',
              },
            },
            {
              selector: 'email',
              errors: {
                duplicate: 'E-Mail bereits vergeben',
              },
            },
          ],
        },
      ],
    }),

    MaterialModule,
    SharedModule,
    UsersRoutingModule,
    UsersStoreModule,
  ],
  providers: [UserDialogService],
})
export class UsersModule {}
