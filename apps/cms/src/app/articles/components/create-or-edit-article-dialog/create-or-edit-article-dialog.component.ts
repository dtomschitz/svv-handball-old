import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  Inject,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
} from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { select, Store } from '@ngrx/store';
import { Article, ArticleCategory, ArticleAuthor } from '@svv/core/models';
import { DialogMode } from '@svv/cms/core/models';
import { CustomValidators } from '@svv/cms/shared/validators';
import * as fromArticle from '@svv/cms/articles/store/reducers';
import * as dayjs from 'dayjs';

export interface CreateOrEditArticleDetailsDialogData {
  mode: DialogMode;
  article?: Article;
  categories: ArticleCategory[];
  authors: ArticleAuthor[];
}

type PreviewArticle = Omit<
  Article,
  '_id' | 'team' | 'authorIds' | 'categoryIds' | 'disabled'
>;

@Component({
  selector: 'create-or-edit-article-dialog',
  templateUrl: './create-or-edit-article-dialog.component.html',
  styleUrls: ['./create-or-edit-article-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateOrEditArticleDetailsDialog {
  articleForm: FormGroup;
  categorySearchControl: FormControl;
  authorSearchControl: FormControl;

  filteredCategories$: Observable<ArticleCategory[]>;
  filteredAuthors$: Observable<ArticleAuthor[]>;
  article$: Observable<PreviewArticle>;

  htmlEditor: boolean = false;

  constructor(
    private articleStore: Store<fromArticle.State>,
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<CreateOrEditArticleDetailsDialog>,
    @Inject(MAT_DIALOG_DATA) public data: CreateOrEditArticleDetailsDialogData,
  ) {
    this.articleForm = this.formBuilder.group({
      title: [
        data?.article?.title,
        Validators.required,
        CustomValidators.duplicateValueValidator(
          this.articleStore.pipe(select(fromArticle.selectAllArticleTitles)),
          data?.article?.title,
        ),
      ],
      subtitle: [data?.article?.subtitle],
      authorIds: [data?.article?.authorIds ?? []],
      categoryIds: [data?.article?.categoryIds ?? []],
      pinned: [data?.article?.pinned ?? false],
      readMore: [data?.article?.readMore ?? true],
      content: [data?.article?.content ?? '', [Validators.required]],
    });
    this.categorySearchControl = this.formBuilder.control('');
    this.authorSearchControl = this.formBuilder.control('');

    this.filteredCategories$ = this.categorySearchControl.valueChanges.pipe(
      startWith(null),
      map((value: string | null) =>
        value
          ? this.data.categories.filter(category => {
              return category.name.toLowerCase().includes(value.toLowerCase());
            })
          : this.data.categories.slice(),
      ),
    );

    this.filteredAuthors$ = this.authorSearchControl.valueChanges.pipe(
      startWith(null),
      map((value: string | null) =>
        value
          ? this.data.authors.filter(author => {
              return author.lastName
                .toLowerCase()
                .includes(value.toLowerCase());
            })
          : this.data.authors.slice(),
      ),
    );

    this.article$ = this.articleForm.valueChanges.pipe(
      map(changes => {
        const article: PreviewArticle = {
          date: dayjs().toISOString(),
          title: changes.title ?? 'Unbekannter Titel',
          subtitle: changes.subtitle ?? 'Unbekannter Untertitel',
          content: changes.content,
          authors: this.authors,
          categories: this.categories,
          readMore: changes.readMore,
          pinned: changes.pinned ?? false,
        };

        return article;
      }),
    );
  }

  pinArticle() {
    const control = this.articleForm.get('pinned');
    control.setValue(!control.value);
    control.markAsDirty();
  }

  save() {
    const {
      title,
      subtitle,
      content,
      authorIds,
      categoryIds,
      readMore,
      pinned,
    } = this.articleForm.value;

    this.dialogRef.close({
      title,
      subtitle,
      content,
      authorIds,
      categoryIds,
      readMore,
      pinned,
    });
  }

  close() {
    this.dialogRef.close();
  }

  toggleHtmlEditor() {
    this.htmlEditor = !this.htmlEditor;
  }

  /**
   * Returns the selected `Categories` of the given values from the from group.
   *
   * @returns The selected `Categories`.
   */
  get categories() {
    const ids: string[] = this.articleForm.get('categoryIds').value;
    return ids.reduce<ArticleCategory[]>((list, id) => {
      const category = this.data.categories.find(c => c._id === id);
      if (category) {
        list.push(category);
      }

      return list;
    }, []);
  }

  /**
   * Returns the selected `Authors` of the given values from the from group.
   *
   * @returns The selected `Authors`.
   */
  get authors() {
    const ids: string[] = this.articleForm.get('authorIds').value;
    return ids.reduce<ArticleAuthor[]>((list, id) => {
      const author = this.data.authors.find(c => c._id === id);
      if (author) {
        list.push(author);
      }

      return list;
    }, []);
  }

  get invalidOrNotDirty() {
    return this.articleForm.invalid || !this.articleForm.dirty;
  }

  get isCreateDialog() {
    return this.data.mode === DialogMode.CREATE;
  }
}
