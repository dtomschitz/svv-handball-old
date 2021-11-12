import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Image } from '@svv/core/models';

/**
 * This component is used for displaying informations about the currently
 * selected `Image` inside the `Teams` data table.
 */
@Component({
  selector: 'image-details',
  templateUrl: './image-details.component.html',
  styleUrls: ['./image-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImageDetailsComponent {
  /**
   * The currently selected `Image`
   */
  @Input() image: Image;
}
