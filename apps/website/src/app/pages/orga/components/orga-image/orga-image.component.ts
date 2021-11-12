import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ImageModalService } from '@svv/common-components/image-modal';

@Component({
  selector: 'orga-image',
  templateUrl: './orga-image.component.html',
  styleUrls: ['./orga-image.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrgaImageContactComponent {
  constructor(private imageModalService: ImageModalService) {}

  openImageModal() {
    this.imageModalService.openImageModal({
      data: {
        title: 'Orga-Team',
        url: 'assets/orga.jpg',
      },
    });
  }
}
