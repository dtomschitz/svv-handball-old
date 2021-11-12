import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { filter, map, takeUntil } from 'rxjs/operators';
import { ContactPersonCategory, NotificationType } from '@svv/core/models';
import { DialogMode } from '@svv/cms/core/models';
import { NotificationActions } from '@svv/cms/core/store/actions';
import {
  ContactPersonCategoryActions,
  ContactPersonCategoriesActions,
} from '@svv/cms/contact-persons/store/actions';
import { ContactPersonCategoriesDialogService } from '@svv/cms/contact-persons/services';
import * as fromContactPersons from '@svv/cms/contact-persons/store/reducers';

@Component({
  selector: 'contact-person-categories',
  templateUrl: './contact-person-categories.component.html',
  styleUrls: ['./contact-person-categories.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactPersonCategoriesComponent implements OnInit, OnDestroy {
  private readonly destroy$: Subject<void> = new Subject<void>();

  categories$: Observable<ContactPersonCategory[]>;
  loading$: Observable<boolean>;

  displayedColumns = ['name', '_id', 'actions'];

  constructor(
    private store: Store<fromContactPersons.State>,
    private categoriesDialogService: ContactPersonCategoriesDialogService,
  ) {
    this.categories$ = this.store.pipe(
      select(fromContactPersons.selectAllContactPersonCategories),
    );
    this.loading$ = this.store.pipe(
      select(fromContactPersons.selectIsContactPersonCategoriesLoading),
    );
  }

  ngOnInit() {
    this.store.dispatch(
      ContactPersonCategoriesActions.loadContactPersonCategories(),
    );
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  createCategory(length: number) {
    this.categoriesDialogService
      .showCreateOrEditContactPersonCategoryDialog({ mode: DialogMode.CREATE })
      .pipe(
        filter(category => !!category),
        map(category => ({
          ...category,
          position: length++,
        })),
        takeUntil(this.destroy$),
      )
      .subscribe(category => {
        this.store.dispatch(
          ContactPersonCategoryActions.createContactPersonCategory({
            category,
          }),
        );
      });
  }

  editCategory(category: ContactPersonCategory) {
    this.categoriesDialogService
      .showCreateOrEditContactPersonCategoryDialog({
        mode: DialogMode.EDIT,
        category,
      })
      .pipe(
        filter(changes => !!changes),
        takeUntil(this.destroy$),
      )
      .subscribe(changes => {
        this.store.dispatch(
          ContactPersonCategoryActions.updateContactPersonCategory({
            update: {
              id: category._id,
              changes,
            },
          }),
        );
      });
  }

  sortCategories(categories: ContactPersonCategory[]) {
    this.categoriesDialogService
      .showSortContactPersonCategoriesDialog({ categories })
      .pipe(
        filter(sortedCategories => !!sortedCategories),
        map(sortedCategories =>
          sortedCategories.map(category => ({
            _id: category._id,
            position: category.position,
          })),
        ),
        takeUntil(this.destroy$),
      )
      .subscribe(sortedCategories => {
        this.store.dispatch(
          ContactPersonCategoriesActions.sortContactPersonCategories({
            updates: sortedCategories.map((category, position) => ({
              id: category._id,
              changes: {
                position,
              },
            })),
          }),
        );
      });
  }

  deleteCategory(category: ContactPersonCategory) {
    this.categoriesDialogService
      .showDeleteContactPersonCategoryDialog(category)
      .pipe(
        filter(confirmed => !!confirmed),
        takeUntil(this.destroy$),
      )
      .subscribe(() =>
        this.store.dispatch(
          ContactPersonCategoryActions.deleteContactPersonCategory({
            id: category._id,
          }),
        ),
      );
  }

  copyCategoryId(event: MouseEvent) {
    this.preventDefault(event);
    this.store.dispatch(
      NotificationActions.showSnackbar({
        notification: {
          type: NotificationType.SUCCESS,
          message: 'Kategorie-ID in Zwischenablage kopiert',
        },
      }),
    );
  }

  refreshCategories() {
    this.store.dispatch(
      ContactPersonCategoriesActions.refreshContactPersonCategories(),
    );
  }

  preventDefault(event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
  }
}
