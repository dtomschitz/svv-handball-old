import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { DialogMode } from '@svv/cms/core/models';
import { filter, takeUntil } from 'rxjs/operators';
import {
  ImageTagActions,
  ImageTagsActions,
} from '@svv/cms/images/store/actions';
import { ImageTagsDialogService } from '@svv/cms/images/services';
import { ImageTag, NotificationType } from '@svv/core/models';
import * as fromImages from '@svv/cms/images/store/reducers';
import { NotificationActions } from '@svv/cms/core/store/actions';

@Component({
  selector: 'tags',
  templateUrl: './tags.component.html',
  styleUrls: ['./tags.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TagsComponent implements OnInit, OnDestroy {
  private readonly destroy$: Subject<void> = new Subject<void>();

  tags$: Observable<ImageTag[]>;
  loading$: Observable<boolean>;

  /**
   * The columns which are displayed in the data table.
   */
  displayedColumns = ['name', '_id', 'actions'];

  constructor(
    private store: Store<fromImages.State>,
    private imageTagsDialogService: ImageTagsDialogService,
  ) {
    this.tags$ = this.store.pipe(select(fromImages.selectAllImageTags));
    this.loading$ = this.store.pipe(
      select(fromImages.selectIsImageTagsLoading),
    );
  }

  ngOnInit() {
    this.store.dispatch(ImageTagsActions.loadImageTags());
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Opens the dialog for creating a new `Image Tag`. After the dialog has been
   * closed the `createTeam` action will be dispatched which will create the new
   * `Team` based on the given form values. The `Team Type` will be set
   * according to the given default `Team Type`.
   *
   * In case the `User` dismissed the dialog no actions will be dispatched which
   * would otherwise trigger the effects for the respective action.
   */
  createImageTag() {
    this.imageTagsDialogService
      .showCreateOrEditImageTagDialog({
        mode: DialogMode.CREATE,
      })
      .pipe(
        filter(tag => !!tag),
        takeUntil(this.destroy$),
      )
      .subscribe(tag => {
        return this.store.dispatch(ImageTagActions.createImageTag({ tag }));
      });
  }

  /**
   * Opens the dialog for modifying a existing `Image Tag`. After the dialog has
   * been closed the `updateImageTag` action will be dispatched which will update
   * the specific `Image Tag` based on the given changes.
   *
   * In case the `User` dismissed the dialog no actions will be dispatched which
   * would otherwise trigger the effects for the respective action.
   *
   * @param tag The `Image Tag` which gets modified.
   */
  editImageTag(tag: ImageTag) {
    this.imageTagsDialogService
      .showCreateOrEditImageTagDialog({
        mode: DialogMode.EDIT,
        tag,
      })
      .pipe(
        filter(changes => !!changes),
        takeUntil(this.destroy$),
      )
      .subscribe(changes => {
        this.store.dispatch(
          ImageTagActions.updateImageTag({
            update: {
              id: tag._id,
              changes,
            },
          }),
        );
      });
  }

  /**
   * Opens the dialog for deleting the given `Image Tag`. After the dialog has
   * been closed the `deleteImageTag` action will be dispatched which will start
   * the deletion process for the `Image Tag`.
   *
   * In case the `User` dismissed the dialog no actions will be dispatched which
   * would otherwise trigger the effects for the respective action.
   *
   * @param tag The `Image Tag` which gets deleted.
   */
  deleteImageTag(tag: ImageTag) {
    this.imageTagsDialogService
      .showDeleteImageTagDialog(tag)
      .pipe(
        filter(confirmed => !!confirmed),
        takeUntil(this.destroy$),
      )
      .subscribe(() =>
        this.store.dispatch(ImageTagActions.deleteImageTag({ id: tag._id })),
      );
  }

  /**
   * Dispatches the `refreshImageTags` action in order to reload the `Image Tags`
   * from the API.
   */
  refreshImageTags() {
    this.store.dispatch(ImageTagsActions.refreshImageTags());
  }

  /**
   * Dispatches the `showSnackbar` action in order to notify the `User` that
   * the id of the respective `Image Tag` of the row has been copied successfully
   * to the clipboard.
   */
  copyTagId(event: MouseEvent) {
    this.preventDefault(event);
    this.store.dispatch(
      NotificationActions.showSnackbar({
        notification: {
          type: NotificationType.SUCCESS,
          message: 'Tag-ID in Zwischenablage kopiert',
        },
      }),
    );
  }

  preventDefault(event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
  }
}
