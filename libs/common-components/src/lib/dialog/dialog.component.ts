import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  HostBinding,
  Input,
  Output,
  ViewEncapsulation,
} from '@angular/core';

/**
 * This component is used as the default dialog container for all dialogs of the
 * CMS application and the website. It consists of the three different sub components
 * `dialog-title`, `dialog-body` and `dialog-actions` which will form the dialog.
 */
@Component({
  selector: 'dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogComponent {
  /**
   * Disables the option to close the dialog.
   */
  @Input() disableClose: boolean;

  /**
   * Gets emitted when the `User` has pressed the close button.
   */
  @Output() closeDialog: EventEmitter<void> = new EventEmitter<void>();

  /**
   * Binds the default css class to the component.
   */
  @HostBinding('class') dialogClass = 'dialog';
}

/**
 * This component is used to project a title or header like component into the
 * CMS dialog.
 */
@Component({
  selector: 'dialog-title',
  template: '<ng-content></ng-content>',
  styleUrls: ['./dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class DialogTitleComponent {
  @HostBinding('class') dialogTitleClass = 'dialog-title';
}

/**
 * This component is used to project the main content into the dialog,
 * e.g. a form.
 */
@Component({
  selector: 'dialog-body',
  template: '<ng-content></ng-content>',
  styleUrls: ['./dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class DialogBodyComponent {
  @HostBinding('class') dialogBodyClass = 'dialog-body';
}

/**
 * This component is used to project the action buttons into the dialog,
 * e.g. a cancel or save button.
 */
@Component({
  selector: 'dialog-actions',
  template: '<ng-content></ng-content>',
  styleUrls: ['./dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class DialogActionsComponent {
  @HostBinding('class') dialogActionsClass = 'dialog-actions';
}
