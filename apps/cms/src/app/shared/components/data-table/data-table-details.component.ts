import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * This component is used as the container for the currently expanded row of
 * the data table.
 */
@Component({
  selector: 'data-table-details',
  template: '<ng-content></ng-content>',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'data-table-details',
  },
})
export class DataTableDetailsComponent {}
