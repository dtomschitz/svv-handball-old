import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { DeviceDetectorService } from 'ngx-device-detector';
import { ImageModalService } from '@svv/common-components/image-modal';
import { Team } from '@svv/core/models';
import { environment } from '@svv/website/environments/environment';

@Component({
  selector: 'team-image',
  templateUrl: './team-image.component.html',
  styleUrls: ['./team-image.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TeamImageComponent {
  private readonly apiUrl = environment.apiUrl;

  @Input() team: Team;

  constructor(
    private imageModalService: ImageModalService,
    private deviceService: DeviceDetectorService,
  ) {}

  openImageModal(team: Team) {
    if (!this.deviceService.isMobile()) {
      this.imageModalService.openImageModal({
        data: {
          title: team.name,
          subtitle: `Mannschaftsfoto 2020/2021`,
          url: this.getImagePath(team.images.big.path),
        },
      });
    }
  }

  getImageAltText(team: Team) {
    return `Mannschaftsfoto ${team?.name}`;
  }

  getImagePath(path: string) {
    if (!path) {
      return undefined;
    }

    return `${this.apiUrl}/${path}`;
  }
}
