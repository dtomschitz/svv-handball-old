import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CalloutType } from './callout.models';

const classes = {
  INFO: 'callout-info',
  WARN: 'callout-warn',
};

const icons = {
  INFO: 'info',
  WARN: 'warning',
};

/**
 * This component serves to inform the user about the consequences of his
 * actions. The content of the component will be easily projected into by the
 * <ng-content> component.
 */
@Component({
  selector: 'callout',
  templateUrl: './callout.component.html',
  styleUrls: ['./callout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalloutComponent {
  /**
   * The type of the callout.
   */
  @Input() type: keyof typeof CalloutType;

  get icon() {
    return icons[this.type];
  }

  get calloutClass() {
    return classes[this.type];
  }
}
