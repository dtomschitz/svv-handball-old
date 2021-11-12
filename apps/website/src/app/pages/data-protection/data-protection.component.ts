import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { SeoService } from '@svv/website/core/services';

@Component({
  selector: 'data-protection',
  templateUrl: './data-protection.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataProtectionComponent implements OnInit {
  constructor(private seoService: SeoService) {}

  ngOnInit() {
    this.seoService.setTitle('Datenschutzerklärung');
  }
}
