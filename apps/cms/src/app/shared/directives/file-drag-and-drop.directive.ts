import {
  Directive,
  EventEmitter,
  HostBinding,
  HostListener,
  Output,
} from '@angular/core';

/**
 * Enables the drag and drop functionallity for the respective component.
 */
@Directive({
  selector: '[fileDragAndDrop]',
})
export class FileDragAndDropDirective {
  /**
   * Gets emitted if a file has been drag and dropped on the component.
   */
  @Output() fileDropped: EventEmitter<File> = new EventEmitter<File>();

  /**
   * Gets emitted if the `User` entered the component with the cursor while
   * dragging a file.
   */
  @Output() dragEnter: EventEmitter<void> = new EventEmitter<void>();

  /**
   * Gets emitted if the `User` left the component with the cursor while
   * dragging a file.
   */
  @Output() dragLeave: EventEmitter<void> = new EventEmitter<void>();

  @HostBinding('class.drop-zone-active')
  active = false;

  @HostListener('dragover', ['$event']) onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
  }

  @HostListener('dragenter', ['$event']) onDragEnter(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();

    this.active = true;
    this.dragEnter.emit();
  }

  @HostListener('dragleave', ['$event']) onDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.active = false;
    this.dragLeave.emit();
  }

  @HostListener('drop', ['$event']) onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();

    const file = event.dataTransfer.files[0];
    if (file) {
      this.fileDropped.emit(file);
    }
  }
}
