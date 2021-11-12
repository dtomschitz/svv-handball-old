import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { filter, map, takeUntil } from 'rxjs/operators';
import { Image, ImageTag, ImageType, NotificationType } from '@svv/core/models';
import { DialogMode } from '@svv/cms/core/models';
import { NotificationActions } from '@svv/cms/core/store/actions';
import {
  ImageActions,
  ImagesActions,
  ImageTagActions,
  ImageTagsActions,
} from '@svv/cms/images/store/actions';
import {
  ImagesDialogService,
  ImageTagsDialogService,
} from '@svv/cms/images/services';
import * as fromImages from '@svv/cms/images/store/reducers';
import { FormBuilder, FormControl } from '@angular/forms';
import { ThrowStmt } from '@angular/compiler';

@Component({
  selector: 'images',
  templateUrl: './images.component.html',
  styleUrls: ['./images.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImagesComponent implements OnInit, OnDestroy {
  private readonly destroy$: Subject<void> = new Subject<void>();

  @Input() images: Image[];
  @Input() filterTags: ImageTag[];
  @Input() disableFilter: boolean;
  @Input() defaultImageType: ImageType;

  tags$: Observable<ImageTag[]>;
  loading$: Observable<boolean>;

  filterControl: FormControl;

  /**
   * The columns which are displayed in the data table.
   */
  displayedColumns = ['name', '_id', 'actions'];
  expandedImage: Image;

  constructor(
    private formBuilder: FormBuilder,
    private store: Store<fromImages.State>,
    private imagesDialogService: ImagesDialogService,
    private imageTagsDialogService: ImageTagsDialogService,
  ) {
    this.filterControl = this.formBuilder.control('');

    this.tags$ = this.store.pipe(select(fromImages.selectAllImageTags));
    this.loading$ = this.store.pipe(select(fromImages.selectIsImagesLoading));
  }

  ngOnInit() {
    this.store.dispatch(ImagesActions.loadImages());
    this.store.dispatch(ImageTagsActions.loadImageTags());

    this;
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Updates the currently selected `Image` in order to display it in the
   * expanded details component.
   *
   * @param image The selected `Image`.
   */
  onRowExpanded(image: Image) {
    if (image) {
      this.expandedImage = image;
    }
  }

  /**
   * Opens the dialog for creating a new `Image Tag`. After the dialog has been
   * closed the `createTeam` action will be dispatched which will create the new
   * `Team` based on the given form values. The `Team Type` will be set
   * according to the given default `Team Type`.
   *
   * In case the `User` dismissed the dialog no actions will be dispatched which
   * would otherwise trigger the effects for the respective action.
   *
   * @param tags The list of `ImageTag` of which multiple can be selected.
   */
  createImage(tags: ImageTag[]) {
    this.imagesDialogService
      .showCreateOrEditImageDialog({
        mode: DialogMode.CREATE,
        tags,
      })
      .pipe(
        filter(result => !!result),
        map(result => ({
          ...result,
          image: {
            ...result.image,
            type: this.defaultImageType,
          },
        })),
        takeUntil(this.destroy$),
      )
      .subscribe(({ image, file }) => {
        return this.store.dispatch(ImageActions.createImage({ image, file }));
      });
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
   * Opens the dialog for modifying a existing `Image`. After the dialog has
   * been closed the `updateImage` action will be dispatched which will update
   * the specific `Image` based on the given changes.
   *
   * In case the `User` dismissed the dialog no actions will be dispatched which
   * would otherwise trigger the effects for the respective action.
   *
   * @param image The `Image` which gets modified.
   *
   * @param tags The list of `ImageTag` of which multiple can be selected.
   */
  editImage(image: Image, tags: ImageTag[]) {
    this.imagesDialogService
      .showCreateOrEditImageDialog({
        mode: DialogMode.EDIT,
        image,
        tags,
      })
      .pipe(
        filter(changes => !!changes),
        takeUntil(this.destroy$),
      )
      .subscribe(changes => {
        this.store.dispatch(
          ImageActions.updateImage({
            update: {
              id: image._id,
              changes: changes.image,
            },
          }),
        );
      });
  }

  /**
   * Opens the dialog for enabling or disabling the given `Image`. After the
   * dialog has been closed the `updateImage` action will be dispatched which
   * will either enable or disable the `Image` based on the previous value.
   *
   * In case the `User` dismissed the dialog no actions will be dispatched which
   * would otherwise trigger the effects for the respective action.
   *
   * @param image The `Image` which gets modified.
   */
  toggleImage(image: Image) {
    this.imagesDialogService
      .showToggleImageDialog(image)
      .pipe(
        filter(toggled => !!toggled),
        takeUntil(this.destroy$),
      )
      .subscribe(() => {
        this.store.dispatch(
          ImageActions.updateImage({
            update: {
              id: image._id,
              changes: {
                disabled: !image.disabled,
              },
            },
          }),
        );
      });
  }

  /**
   * Opens the dialog for deleting the given `Image`. After the dialog has been
   * closed the `deleteImage` action will be dispatched which will start the
   * deletion process for the `Image`.
   *
   * In case the `User` dismissed the dialog no actions will be dispatched which
   * would otherwise trigger the effects for the respective action.
   *
   * @param image The `Image` which gets modified.
   */
  deleteImage(image: Image) {
    this.imagesDialogService
      .showDeleteImageDialog(image)
      .pipe(
        filter(confirmed => !!confirmed),
        takeUntil(this.destroy$),
      )
      .subscribe(() =>
        this.store.dispatch(ImageActions.deleteImage({ id: image._id })),
      );
  }

  /**
   * Dispatches the `refreshImages` action in order to reload the `Images`
   * from the API.
   */
  refreshImages() {
    this.store.dispatch(ImagesActions.refreshImages());
  }

  /**
   * Dispatches the `showSnackbar` action in order to notify the `User` that
   * the id of the respective `Image` of the row has been copied successfully
   * to the clipboard.
   */
  copyImageId(event: MouseEvent) {
    this.preventDefault(event);
    this.store.dispatch(
      NotificationActions.showSnackbar({
        notification: {
          type: NotificationType.SUCCESS,
          message: 'Bild-ID in Zwischenablage kopiert',
        },
      }),
    );
  }

  preventDefault(event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
  }
}
