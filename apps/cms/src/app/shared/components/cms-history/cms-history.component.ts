import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'cms-history',
  templateUrl: './cms-history.component.html',
  styleUrls: ['./cms-history.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'cms-history',
  },
})
export class CmsHistoryComponent {}
