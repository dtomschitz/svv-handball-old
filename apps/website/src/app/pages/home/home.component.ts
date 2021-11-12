import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { SeoService } from '@svv/website/core/services';

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent implements OnInit {
  constructor(private seoService: SeoService) {}

  ngOnInit() {
    this.seoService.setTitle('Startseite');
  }
}
