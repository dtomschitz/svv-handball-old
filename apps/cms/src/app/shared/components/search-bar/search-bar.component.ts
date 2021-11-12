import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';

/**
 * This component is used as an searchbar which is currently only used inside
 * the `Data Table`component.
 */
@Component({
  selector: 'search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchBarComponent {
  /**
   * The placeholder of the input field.
   */
  @Input() placeholder = '';

  /**
   * Gets emitted if the value of the input field has been changed.
   */
  @Output() valueChange: EventEmitter<string> = new EventEmitter<string>();

  focused = false;
}
