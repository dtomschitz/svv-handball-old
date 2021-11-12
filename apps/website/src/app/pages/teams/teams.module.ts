import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ImageModalModule } from '@svv/common-components/image-modal';
import { ShimmerPlaceholderModule } from '@svv/common-components/shimmer-placeholder';
import { LazyImageModule } from '@svv/common-components/lazy-image';
import { CalloutModule } from '@svv/common-components/callout';
import { MaterialModule } from '@svv/website/shared/material';
import { DirectivesModule } from '@svv/website/shared/directives';
import { PipesModule } from '@svv/website/shared/pipes';
import { ArticlesModule } from '@svv/website/shared/components/articles';
import { GamesModule } from '@svv/website/shared/components/games';
import {
  HVWScheduleComponent,
  HVWTableComponent,
  TeamArticlesComponent,
  TeamCoachesComponent,
  TeamContactComponent,
  TeamHeaderComponent,
  TeamImageComponent,
  TrainingTimesComponent,
} from './components';
import { TeamComponent } from './team.component';
import { TeamsRoutingModule } from './teams-routing.module';

@NgModule({
  imports: [
    CommonModule,
    ImageModalModule,
    ShimmerPlaceholderModule,
    LazyImageModule,
    CalloutModule,
    ArticlesModule,
    GamesModule,
    DirectivesModule,
    PipesModule,
    MaterialModule,
    TeamsRoutingModule,
  ],
  declarations: [
    TeamComponent,
    HVWScheduleComponent,
    HVWTableComponent,
    TeamArticlesComponent,
    TeamCoachesComponent,
    TeamContactComponent,
    TeamHeaderComponent,
    TeamImageComponent,
    TrainingTimesComponent,
  ],
})
export class TeamsModule {}
