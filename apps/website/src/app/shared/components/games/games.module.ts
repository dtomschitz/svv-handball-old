import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { GoogleMapsModule } from '@angular/google-maps';
import { DialogModule } from '@svv/common-components/dialog';
import { CalloutModule } from '@svv/common-components/callout';
import { ShimmerPlaceholderModule } from '@svv/common-components/shimmer-placeholder';
import { MaterialModule } from '@svv/website/shared/material';
import { GameCardComponent } from './game-card';
import { GamesComponent } from './games.component';
import { GymInfoDialog } from './gym-info-dialog';
import { GymInfoSheet } from './gym-info-sheet';
import { GymInfoComponent } from './gym-info';

@NgModule({
  declarations: [
    GamesComponent,
    GameCardComponent,
    GymInfoComponent,
    GymInfoDialog,
    GymInfoSheet,
  ],
  imports: [
    CommonModule,
    GoogleMapsModule,
    MaterialModule,
    DialogModule,
    CalloutModule,
    ShimmerPlaceholderModule,
  ],
  exports: [
    GamesComponent,
    GameCardComponent,
    GymInfoComponent,
    GymInfoDialog,
    GymInfoSheet,
  ],
})
export class GamesModule {}
