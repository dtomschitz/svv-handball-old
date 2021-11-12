import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';

/**
 * This component is used as the standard drag and drop zone for uploading
 * images and is used to manage the information of the uploaded file. If an
 * image has been selected the `file Dropped` event gets emitted in order to
 * trigger further actions like the uploading of the image.
 */
@Component({
  selector: 'cms-image',
  templateUrl: './cms-image.component.html',
  styleUrls: ['./cms-image.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'cms-image',
  },
})
export class CmsImageComponent {
  /**
   * The accepted file types.
   */
  @Input() accept: string[] = ['.png', '.jpg', '.jpeg'];

  /**
   * Gets emitted if the `User` has dropped a file in the drag and drop zone.
   */
  @Output() fileDropped: EventEmitter<File> = new EventEmitter<File>();

  @ViewChild('fileDropRef') fileDropRef: ElementRef;

  showDragAndDrop = false;
  image: File;

  onDragEnter() {
    this.showDragAndDrop = true;
  }

  onDragLeave() {
    this.showDragAndDrop = false;
  }

  openFileBrowser() {
    const event = new MouseEvent('click', { bubbles: false });
    this.fileDropRef.nativeElement.dispatchEvent(event);
  }

  handleFileBrowserChange(files: FileList) {
    this.onFileDropped(files[0]);
  }

  onFileDropped(image: File) {
    this.image = image;
    this.fileDropped.emit(image);
  }

  removeImage() {
    this.image = undefined;
  }
}
