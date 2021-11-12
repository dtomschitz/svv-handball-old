import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * This component is used in order to inform the `User` that the data table
 * has currenty no data. Thanks to the content projection the component can handle
 * everything.
 */
@Component({
  selector: 'data-table-no-data',
  template: '<ng-content></ng-content>',
  styleUrls: ['./data-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'data-table-no-data',
  },
})
export class DataTableNoDataComponent {}
