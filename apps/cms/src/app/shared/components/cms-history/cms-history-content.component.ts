import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';

@Component({
  selector: 'cms-history-content',
  template: '<ng-content></ng-content>',
  styleUrls: ['./cms-history.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'cms-history-content',
  },
})
export class CmsHistoryContentComponent {}
