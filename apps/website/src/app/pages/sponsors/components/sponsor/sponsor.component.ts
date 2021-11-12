import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Sponsor } from '@svv/core/models';
import { environment } from '@svv/website/environments/environment';

@Component({
  selector: 'sponsor',
  templateUrl: './sponsor.component.html',
  styleUrls: ['./sponsor.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SponsorComponent {
  private readonly apiUrl = environment.apiUrl;

  @Input() sponsor: Sponsor;
  @Input() loading: boolean;

  get imageSrc() {
    return `${this.apiUrl}/${this.sponsor.img.path}`;
  }
}
