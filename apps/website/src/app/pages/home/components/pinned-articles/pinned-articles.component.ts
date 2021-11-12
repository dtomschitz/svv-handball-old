import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Article } from '@svv/core/models';
import { takeUntil } from 'rxjs/operators';
import {
  ArticlesQuery,
  ArticlesService,
  ArticlesStore,
} from '@svv/website/state/articles';

@Component({
  selector: 'pinned-articles',
  templateUrl: './pinned-articles.component.html',
  styleUrls: ['./pinned-articles.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PinnedArticlesComponent implements OnInit, OnDestroy {
  private readonly destroy$: Subject<void> = new Subject<void>();

  articles$: Observable<Article[]>;

  constructor(
    private articlesQuery: ArticlesQuery,
    private articlesService: ArticlesService,
  ) {
    this.articles$ = this.articlesQuery.selectPinnedArticles();
  }

  ngOnInit() {
    this.articlesService
      .getPinnedArticles()
      .pipe(takeUntil(this.destroy$))
      .subscribe();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
