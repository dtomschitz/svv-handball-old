import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
} from '@angular/core';

/**
 * This component is used as an customanziable navigation button which can be used
 * inside the navigation panel.
 */
@Component({
  selector: 'nav-item',
  templateUrl: './nav-item.component.html',
  styleUrls: ['./nav-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavItemComponent {
  /**
   * The icon which is displayed on the right side of the button text.
   */
  @Input() icon = '';

  /**
   * The link where the router should navigate to if the button has been pressed.
   */
  @Input() routerLink: string | any[];

  /**
   * Gets emitted if the button has been pressed.
   */
  @Output() navigate = new EventEmitter();
}
