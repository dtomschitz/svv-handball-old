import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ImageModalService } from '@svv/common-components/image-modal';
import { SeoService } from '@svv/website/core/services';

@Component({
  selector: 'orga',
  templateUrl: './orga.component.html',
  styleUrls: ['./orga.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrgaComponent {
  constructor(
    private seoService: SeoService,
    private imageModalService: ImageModalService,
  ) {}

  openImageModal() {
    this.seoService.setTitle('Orga Team');
    this.imageModalService.openImageModal({
      data: {
        title: 'Orga Team',
        url: 'assets/orga.jpg',
      },
    });
  }
}
