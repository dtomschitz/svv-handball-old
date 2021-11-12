import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { SeoService } from '@svv/website/core/services';

@Component({
  selector: 'downloads',
  templateUrl: './downloads.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DownloadsComponent implements OnInit {
  constructor(private seoService: SeoService) {}

  ngOnInit() {
    this.seoService.setTitle('Downloads');
  }
}
