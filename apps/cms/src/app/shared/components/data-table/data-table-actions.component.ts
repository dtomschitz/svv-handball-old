import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * This component is used as the container for the action buttons
 * of the data table.
 */
@Component({
  selector: 'data-table-actions',
  template: '<ng-content></ng-content>',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'data-table-actions',
  },
})
export class DataTableActionsComponent {}
