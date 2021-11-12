import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { ArticleComponent, SanitizeHtmlPipe } from './article.component';
import { ShimmerPlaceholderModule } from '../shimmer-placeholder';

@NgModule({
  declarations: [ArticleComponent, SanitizeHtmlPipe],
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    ShimmerPlaceholderModule,
  ],
  exports: [ArticleComponent],
})
export class ArticleModule {}
