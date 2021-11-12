import { ComponentType } from '@angular/cdk/portal';
import { Injector } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import {
  ConfirmationDialog,
  ConfirmationDialogData,
} from '@svv/cms/core/components';

export abstract class DialogService {
  protected dialog: MatDialog;

  constructor(injector: Injector) {
    this.dialog = injector.get(MatDialog);
  }

  /**
   * Opens a modal dialog containing the given component.
   *
   * @param component Type of the component to load into the dialog.
   * @param config Extra configuration options.
   *
   * @returns The observable that will notified when the dialog has been closed.
   */
  showDialog<T, D = any, R = any>(
    component: ComponentType<T>,
    config?: MatDialogConfig<D>,
  ) {
    return this.dialog
      .open<T, D, R>(component, {
        ...config,
        autoFocus: false,
      })
      .afterClosed();
  }

  /**
   * Opens the default confirmation dialog.
   *
   * @param config Extra configuration options.
   *
   * @returns The observable that will notified when the dialog has been closed.
   */
  showConfirmationDialog<D = ConfirmationDialogData, R = boolean>(
    config?: MatDialogConfig<D>,
  ) {
    return this.showDialog<ConfirmationDialog, D, R>(ConfirmationDialog, {
      width: '512px',
      ...config,
    });
  }

  /**
   * Opens the default toggle dialog.
   *
   * @param config Extra configuration options.
   *
   * @returns The observable that will notified when the dialog has been closed.
   */
  showDefaultToggleDialog<D = Partial<ConfirmationDialogData>, R = boolean>(
    state: boolean,
    config?: MatDialogConfig<D>,
  ) {
    return this.showConfirmationDialog<D, R>({
      ...config,
      data: {
        ...config.data,
        buttons: {
          confirm: {
            title: state ? 'Aktivieren' : 'Deaktivieren',
            color: state ? 'primary' : 'warn',
          },
          cancel: 'Abbrechen',
        },
      },
    });
  }

  /**
   * Opens the default deletion dialog.
   *
   * @param config Extra configuration options.
   *
   * @returns The observable that will notified when the dialog has been closed.
   */
  showDefaultDeleteDialog<D = Partial<ConfirmationDialogData>, R = boolean>(
    config?: MatDialogConfig<D>,
  ) {
    return this.showConfirmationDialog<D, R>({
      ...config,
      data: {
        ...config.data,
        buttons: {
          confirm: {
            title: 'Löschen',
            color: 'warn',
          },
          cancel: 'Abbrechen',
        },
      },
    });
  }

  /**
   * Closes all the currently opened dialogs.
   */
  closeAll() {
    this.dialog.closeAll();
  }
}
