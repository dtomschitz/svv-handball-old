import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { ErrorResponse, Sponsor } from '@svv/core/models';
import { SeoService } from '@svv/website/core/services';
import { SponsorsQuery, SponsorsService } from '@svv/website/state/sponsors';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'sponsors',
  templateUrl: './sponsors.component.html',
  styleUrls: ['./sponsors.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SponsorsComponent implements OnInit, OnDestroy {
  private readonly destroy$: Subject<void> = new Subject<void>();

  sponsors$: Observable<Sponsor[]>;
  loading$: Observable<boolean>;
  error$: Observable<ErrorResponse>;

  constructor(
    private seoService: SeoService,
    private sponsorsService: SponsorsService,
    private sponsorsQuery: SponsorsQuery,
  ) {
    this.sponsors$ = this.sponsorsQuery.selectSponsors();
    this.loading$ = this.sponsorsQuery.selectLoading();
    this.error$ = this.sponsorsQuery.selectError();
  }

  ngOnInit() {
    this.seoService.setTitle('Sponsoren');

    this.sponsorsService
      .getSponsors()
      .pipe(takeUntil(this.destroy$))
      .subscribe();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  emptyArray(length: number) {
    return Array(length);
  }
}
