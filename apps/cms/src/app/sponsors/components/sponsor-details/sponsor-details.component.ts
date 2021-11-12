import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { Sponsor } from '@svv/core/models';
import { environment } from '@svv/cms/environments/environment';

/**
 * This component is used for displaying informations about the currently selected
 * `Sponsor` inside the `Sponsors` data table.
 */
@Component({
  selector: 'sponsor-details',
  templateUrl: './sponsor-details.component.html',
  styleUrls: ['./sponsor-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SponsorDetailsComponent {
  private apiUrl = environment.apiUrl;

  /**
   * The currently selected `Sponsor`
   */
  @Input() sponsor: Sponsor;

  /**
   * Gets emitted if the edit button has been pressed.
   */
  @Output() editSponsorImage: EventEmitter<void> = new EventEmitter<void>();

  /**
   * Gets emitted if the toggle button has been pressed.
   */
  @Output() toggleSponsorImage: EventEmitter<void> = new EventEmitter<void>();

  /**
   * Gets emitted if the delete button has been pressed.
   */
  @Output() deleteSponsorImage: EventEmitter<void> = new EventEmitter<void>();

  preventDefault(event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
  }

  /**
   * @returns The default image path.
   */
  get imagePath() {
    return `${this.apiUrl}/${this.sponsor.img.path}`;
  }
}
