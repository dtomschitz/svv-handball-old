import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ArticleModule } from '@svv/common-components/article';
import { CalloutModule } from '@svv/common-components/callout';
import { ShimmerPlaceholderModule } from '@svv/common-components/shimmer-placeholder';
import { MaterialModule } from '@svv/website/shared/material';
import { DirectivesModule } from '@svv/website/shared/directives';
import { ArticlesComponent } from './articles.component';
import { ArticlesService } from '@svv/website/state/articles';

@NgModule({
  declarations: [ArticlesComponent],
  imports: [
    CommonModule,
    MaterialModule,
    CalloutModule,
    ShimmerPlaceholderModule,
    ArticleModule,
    DirectivesModule,
  ],
  providers: [ArticlesService],
  exports: [ArticlesComponent],
})
export class ArticlesModule {}
