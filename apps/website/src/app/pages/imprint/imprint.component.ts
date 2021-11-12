import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { SeoService } from '@svv/website/core/services';

@Component({
  selector: 'imprint',
  templateUrl: './imprint.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImprintComponent implements OnInit {
  constructor(private seoService: SeoService) {}

  ngOnInit() {
    this.seoService.setTitle('Impressum');
  }
}
