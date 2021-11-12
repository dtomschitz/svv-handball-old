import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  OnDestroy,
  Input,
} from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import {
  Article,
  ArticleAuthor,
  ArticleCategory,
  NotificationType,
  User,
} from '@svv/core/models';
import { DialogMode } from '@svv/cms/core/models';
import { NotificationActions } from '@svv/cms/core/store/actions';
import {
  ArticlesActions,
  ArticleActions,
  CategoriesActions,
} from '@svv/cms/articles/store/actions';
import { ArticleDialogService } from '@svv/cms/articles/services';
import { UsersActions } from '@svv/cms/users/store/actions';
import * as fromArticle from '@svv/cms/articles/store/reducers';
import * as fromUser from '@svv/cms/users/store/reducers';
import * as dayjs from 'dayjs';

/**
 * This component is used to display the `Articles` data table.
 */
@Component({
  selector: 'articles',
  templateUrl: './articles.component.html',
  styleUrls: ['./articles.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArticlesComponent implements OnInit, OnDestroy {
  private destroy$: Subject<void> = new Subject<void>();

  @Input() articles: Article[];

  categories$: Observable<ArticleCategory[]>;
  authors$: Observable<User[]>;
  loading$: Observable<boolean>;

  /**
   * The columns which are displayed in the data table.
   */
  displayedColumns = ['title', 'subtitle', 'date', '_id', 'actions'];
  expandedArticle: Article;

  constructor(
    private store: Store<fromArticle.State & fromUser.State>,
    private articleDialogService: ArticleDialogService,
  ) {
    this.categories$ = this.store.pipe(select(fromArticle.selectAllCategories));
    this.authors$ = this.store.pipe(select(fromUser.selectAllAuthors));
    this.loading$ = this.store.pipe(
      select(fromArticle.selectIsArticlesLoading),
    );
  }

  ngOnInit() {
    this.store.dispatch(ArticlesActions.loadArticles());
    this.store.dispatch(CategoriesActions.loadCategories());
    this.store.dispatch(UsersActions.loadUsers());
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Updates the currently selected `Article` in order to display it in the
   * expanded details component.
   *
   * @param sponsor The selected `Article`.
   */
  onRowExpanded(article: Article) {
    if (article) {
      this.expandedArticle = article;
    }
  }

  /**
   * Opens the dialog for creating a new `Article`. After the dialog has been
   * closed the `createSponsor` action will be dispatched which will create the
   *  new `Article` based on the given form values.
   *
   * In case the `User` dismissed the dialog no actions will be dispatched which
   * would otherwise trigger the effects for the respective action.
   *
   * @param categories The currently stored `Article Categories` which the `User`
   * can select in the dialog.
   *
   * @param authors The currently stored `Authors` which the `User`
   * can select in the dialog.
   */
  createArticle(categories: ArticleCategory[], authors: User[]) {
    this.articleDialogService
      .showCreateOrEditArticleDialog({
        mode: DialogMode.CREATE,
        categories,
        authors,
      })
      .pipe(
        filter(result => !!result),
        takeUntil(this.destroy$),
      )
      .subscribe(article => {
        this.store.dispatch(
          ArticleActions.createArticle({
            article: { ...article, date: dayjs().toISOString() },
          }),
        );
      });
  }

  /**
   * Opens the dialog for modifying a existing `Article`. After the dialog has
   * been closed the `updateArticle` action will be dispatched which will update
   * the specific `Article` based on the given changes.
   *
   * In case the `User` dismissed the dialog no actions will be dispatched which
   * would otherwise trigger the effects for the respective action.
   *
   * @param article The `Article` which gets modified.
   *
   * @param categories The currently stored `Article Categories` which the `User`
   * can select in the dialog.
   *
   * @param authors The currently stored `Authors` which the `User`
   * can select in the dialog.
   */
  editArticle(
    article: Article,
    categories: ArticleCategory[],
    authors: ArticleAuthor[],
  ) {
    this.articleDialogService
      .showCreateOrEditArticleDialog({
        mode: DialogMode.EDIT,
        article,
        categories,
        authors,
      })
      .pipe(
        filter(details => !!details),
        takeUntil(this.destroy$),
      )
      .subscribe(changes => {
        this.store.dispatch(
          ArticleActions.updateArticle({
            update: {
              id: article._id,
              changes,
            },
          }),
        );
      });
  }

  /**
   * Opens the dialog for enabling or disabling the given `Article`. After the
   * dialog has been closed the `updateArticle` action will be dispatched which
   * will either enable or disable the `Article` based on the previous value.
   *
   * In case the `User` dismissed the dialog no actions will be dispatched which
   * would otherwise trigger the effects for the respective action.
   *
   * @param article The `Article` which gets modified.
   */
  toggleArticle(article: Article) {
    this.articleDialogService
      .showToggleArticleDialog({ article })
      .pipe(
        filter(toggled => !!toggled),
        takeUntil(this.destroy$),
      )
      .subscribe(() =>
        this.store.dispatch(
          ArticleActions.updateArticle({
            update: {
              id: article._id,
              changes: {
                disabled: !article.disabled,
              },
            },
          }),
        ),
      );
  }

  /**
   * Dispatches the `updateArticle` action in order to unpin the given `Article`.
   *
   * @param article The `Article` which gets modified.
   */
  unpinArticle(article: Article) {
    this.store.dispatch(
      ArticleActions.updateArticle({
        update: {
          id: article._id,
          changes: {
            pinned: false,
          },
        },
      }),
    );
  }

  /**
   * Opens the dialog for deleting the given `Article`. After the dialog has
   * been closed the `deleteArticle` action will be dispatched which will start
   * the deletion process for the `Article`.
   *
   * In case the `User` dismissed the dialog no actions will be dispatched which
   * would otherwise trigger the effects for the respective action.
   *
   * @param article The `Article` which gets deleted.
   */
  deleteArticle(article: Article) {
    this.articleDialogService
      .showDeleteArticleDialog({ article })
      .pipe(
        filter(confirmed => !!confirmed),
        takeUntil(this.destroy$),
      )
      .subscribe(() =>
        this.store.dispatch(
          ArticleActions.deleteArticle({
            id: article._id,
          }),
        ),
      );
  }

  /**
   * Dispatches the `refreshArticles` action in order to reload the `Articles`
   * from the API.
   */
  refreshArticles(): void {
    this.store.dispatch(ArticlesActions.refreshArticles());
  }

  /**
   * Dispatches the `showSnackbar` action in order to notify the `User` that
   * the id of the respective `Article` of the row has been copied successfully
   * to the clipboard.
   */
  copyArticleId(event: MouseEvent) {
    this.preventDefault(event);
    this.store.dispatch(
      NotificationActions.showSnackbar({
        notification: {
          type: NotificationType.SUCCESS,
          message: 'Bericht-ID in Zwischenablage kopiert',
        },
      }),
    );
  }

  preventDefault(event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
  }
}
