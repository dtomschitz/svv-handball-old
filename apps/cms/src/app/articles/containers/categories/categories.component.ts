import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { ArticleCategory, NotificationType } from '@svv/core/models';
import { DialogMode } from '@svv/cms/core/models';
import {
  CategoriesActions,
  CategoryActions,
} from '@svv/cms/articles/store//actions';
import { CategoryDialogService } from '@svv/cms/articles/services';
import * as fromCategory from '@svv/cms/articles/store/reducers';
import { NotificationActions } from '@svv/cms/core/store/actions';

/**
 * This component is used to display the `Article Categories` data table.
 */
@Component({
  selector: 'categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoriesComponent implements OnInit, OnDestroy {
  private destroy$: Subject<void> = new Subject<void>();

  categories$: Observable<ArticleCategory[]>;
  loading$: Observable<boolean>;

  /**
   * The columns which are displayed in the data table.
   */
  displayedColumns = ['name', '_id', 'actions'];
  expandedCategories: ArticleCategory;

  constructor(
    private store: Store<fromCategory.State>,
    private categoryDialogService: CategoryDialogService,
  ) {
    this.categories$ = this.store.pipe(
      select(fromCategory.selectAllCategories),
    );
    this.loading$ = this.store.pipe(
      select(fromCategory.selectIsArticleCategoriesLoading),
    );
  }

  ngOnInit() {
    this.store.dispatch(CategoriesActions.loadCategories());
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Opens the dialog for creating a new `Article Category`. After the dialog
   * has been closed the `createCategory` action will be dispatched which will
   * create the new `Article Category` based on the given form values.
   *
   * In case the `User` dismissed the dialog no actions will be dispatched which
   * would otherwise trigger the effects for the respective action.
   */
  createCategory() {
    this.categoryDialogService
      .showCreateOrEditCategoryDialog({ mode: DialogMode.CREATE })
      .pipe(
        filter(result => !!result),
        takeUntil(this.destroy$),
      )
      .subscribe(category =>
        this.store.dispatch(CategoryActions.createCategory({ category })),
      );
  }

  /**
   * Opens the dialog for modifying a existing `Article Category`. After the
   * dialog has been closed the `updateCategory` action will be dispatched which
   * will update the specific `Article Category` based on the given changes.
   *
   * In case the `User` dismissed the dialog no actions will be dispatched which
   * would otherwise trigger the effects for the respective action.
   *
   * @param category The `Article Category` which gets modified.
   */
  editCategory(category: ArticleCategory) {
    this.categoryDialogService
      .showCreateOrEditCategoryDialog({ mode: DialogMode.EDIT, category })
      .pipe(
        filter(details => !!details),
        takeUntil(this.destroy$),
      )
      .subscribe(changes => {
        this.store.dispatch(
          CategoryActions.updateCategory({
            update: {
              id: category._id,
              changes,
            },
          }),
        );
      });
  }

  /**
   * Opens the dialog for deleting the given `Article Category`. After the dialog
   * has been closed the `deleteCategory` action will be dispatched which will
   * start the deletion process for the `Article Category`.
   *
   * In case the `User` dismissed the dialog no actions will be dispatched which
   * would otherwise trigger the effects for the respective action.
   *
   * @param category The `Article Category` which gets deleted.
   */
  deleteCategory(category: ArticleCategory) {
    this.categoryDialogService
      .showDeleteCategoryDialog({ category })
      .pipe(
        filter(confirmed => !!confirmed),
        takeUntil(this.destroy$),
      )
      .subscribe(() =>
        this.store.dispatch(
          CategoryActions.deleteCategory({
            id: category._id,
          }),
        ),
      );
  }

  /**
   * Dispatches the `refreshArticles` action in order to reload the `Articles`
   * from the API.
   */
  refreshCategories() {
    this.store.dispatch(CategoriesActions.refreshCategories());
  }

  copyCategoryId() {
    this.store.dispatch(
      NotificationActions.showSnackbar({
        notification: {
          type: NotificationType.SUCCESS,
          message: 'Kategorie-ID in Zwischenablage kopiert',
        },
      }),
    );
  }
}
