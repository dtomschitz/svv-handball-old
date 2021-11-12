import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ImageModalService } from '@svv/common-components/image-modal';

@Component({
  selector: 'organization-chart',
  templateUrl: './organization-chart.component.html',
  styleUrls: ['./organization-chart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrganizationChartComponent {
  constructor(private imageModalService: ImageModalService) {}

  openImageModal() {
    this.imageModalService.openImageModal({
      data: {
        title: 'Organigramm',
        url: 'assets/organigramm.jpg',
      },
    });
  }
}
