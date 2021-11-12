import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ReactiveComponentModule } from '@ngrx/component';
import { QuillModule } from 'ngx-quill';
import { DialogModule } from '@svv/common-components/dialog';
import { CalloutModule } from '@svv/common-components/callout';
import { ArticleModule } from '@svv/common-components/article';
import { ErrorTailorModule } from '@svv/error-tailor';
import { SharedModule } from '@svv/cms/shared';
import { MaterialModule } from '@svv/cms/material';
import { UsersStoreModule } from '@svv/cms/users';
import {
  AllArticlesComponent,
  ArticlesComponent,
  CategoriesComponent,
  PinnedArticlesComponent,
} from './containers';
import {
  CreateOrEditArticleDetailsDialog,
  CreateOrEditCategoryDetailsDialog,
  DeleteCategoryDialog,
  DeleteArticleDialog,
  ToggleArticleDialog,
} from './components';
import { ArticleDialogService, CategoryDialogService } from './services';
import { ArticlesRoutingModule } from './articles-routing.module';
import { ArticlesStoreModule } from './articles-store.module';

import './overwrite-quill-icons';

@NgModule({
  declarations: [
    AllArticlesComponent,
    ArticlesComponent,
    CategoriesComponent,
    PinnedArticlesComponent,
    CreateOrEditArticleDetailsDialog,
    CreateOrEditCategoryDetailsDialog,
    DeleteArticleDialog,
    DeleteCategoryDialog,
    ToggleArticleDialog,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ReactiveComponentModule,
    QuillModule.forRoot({
      modules: {
        toolbar: {
          container: [
            ['bold', 'italic', 'underline', 'strike'],
            [{ list: 'ordered' }, { list: 'bullet' }],
            ['link'],
          ],
        },
      },
    }),
    CalloutModule,
    DialogModule,
    ArticleModule,
    ErrorTailorModule.forFeature({
      groupErrors: [
        {
          selector: ['createArticle', 'editArticle'],
          controls: [
            {
              selector: 'title',
              errors: {
                duplicate: 'Titel bereits vergeben',
              },
            },
          ],
        },
      ],
    }),
    SharedModule,
    MaterialModule,
    UsersStoreModule,
    ArticlesRoutingModule,
    ArticlesStoreModule,
  ],
  providers: [ArticleDialogService, CategoryDialogService],
})
export class ArticlesModule {}
