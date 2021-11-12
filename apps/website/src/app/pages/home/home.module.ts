import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CalloutModule } from '@svv/common-components/callout';
import { ArticleModule } from '@svv/common-components/article';
import { ShimmerPlaceholderModule } from '@svv/common-components/shimmer-placeholder';
import { DirectivesModule } from '@svv/website/shared/directives';
import { PipesModule } from '@svv/website/shared/pipes';
import { ArticlesModule } from '@svv/website/shared/components/articles';
import { GamesModule } from '@svv/website/shared/components/games';
import { MaterialModule } from '@svv/website/shared/material';
import {
  EncountersComponent,
  EncountersControlComponent,
  EncountersFilterComponent,
  HomeArticlesComponent,
  PinnedArticlesComponent,
} from './components';
import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ArticleModule,
    CalloutModule,
    ShimmerPlaceholderModule,
    GamesModule,
    ArticlesModule,
    DirectivesModule,
    PipesModule,
    MaterialModule,
    HomeRoutingModule,
  ],
  declarations: [
    HomeComponent,
    EncountersComponent,
    EncountersControlComponent,
    EncountersFilterComponent,
    HomeArticlesComponent,
    PinnedArticlesComponent,
  ],
})
export class HomeModule {}
