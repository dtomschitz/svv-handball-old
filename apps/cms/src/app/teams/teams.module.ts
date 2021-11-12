import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ReactiveComponentModule } from '@ngrx/component';
import { ErrorTailorModule } from '@svv/error-tailor';
import { CalloutModule } from '@svv/common-components/callout';
import { DialogModule } from '@svv/common-components/dialog';
import { SharedModule } from '@svv/cms/shared';
import { MaterialModule } from '@svv/cms/material';
import { UsersStoreModule } from '@svv/cms/users';
import { ImagesModule } from '@svv/cms/images';
import { HvwModule } from '@svv/cms/hvw';
import { ArticlesStoreModule } from '@svv/cms/articles';
import {
  ActiveTeamsComponent,
  YouthTeamsComponent,
  TeamsComponent,
  TeamImagesComponent,
} from './containers';
import {
  CreateOrEditTeamDialog,
  SortTeamsDialog,
  EditTeamCoachesDialog,
  EditTeamImageDialog,
  EditTrainingTime,
  TeamDetailsComponent,
  EditTeamTrainingsDialog,
} from './components';
import { TeamDialogService } from './services';
import { TeamsRoutingModule } from './teams-routing.module';
import { TeamsStoreModule } from './teams-store.module';

@NgModule({
  declarations: [
    TeamsComponent,
    TeamImagesComponent,
    CreateOrEditTeamDialog,
    SortTeamsDialog,
    ActiveTeamsComponent,
    YouthTeamsComponent,
    EditTeamCoachesDialog,
    EditTeamImageDialog,
    EditTeamTrainingsDialog,
    EditTrainingTime,
    TeamDetailsComponent,
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
          selector: ['createTeam', 'editTeam'],
          controls: [
            {
              selector: 'name',
              errors: {
                duplicate: 'Name bereits vergeben',
              },
            },
            {
              selector: 'abbreviation',
              errors: {
                duplicate: 'Abkürzung bereits vergeben',
              },
            },
          ],
        },
      ],
    }),
    SharedModule,
    MaterialModule,
    TeamsRoutingModule,
    TeamsStoreModule,
    UsersStoreModule,
    ArticlesStoreModule,
    HvwModule,
    ImagesModule,
  ],
  providers: [TeamDialogService],
})
export class TeamsModule {}
