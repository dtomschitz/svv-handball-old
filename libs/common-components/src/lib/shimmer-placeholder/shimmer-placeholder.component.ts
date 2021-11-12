import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * This component is used as an loading placeholder which has impleted the
 * shimmer effect in order to inform the `User` about an ongoing loading process.
 */
@Component({
  selector: 'shimmer-placeholder',
  templateUrl: './shimmer-placeholder.component.html',
  styleUrls: ['./shimmer-placeholder.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'shimmer-placeholder',
  },
})
export class ShimmerPlaceholderComponent {}
