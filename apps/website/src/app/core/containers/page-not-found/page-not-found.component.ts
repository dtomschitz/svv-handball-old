import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { HttpContextService } from '@svv/website/core/services';

@Component({
  selector: 'page-not-found',
  templateUrl: './page-not-found.component.html',
  styleUrls: ['./page-not-found.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageNotFoundComponent implements OnInit {
  constructor(private httpContext: HttpContextService) {}

  ngOnInit() {
    this.httpContext.setStatusCode(404);
  }
}
