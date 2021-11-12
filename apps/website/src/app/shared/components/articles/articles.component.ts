import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { Router } from '@angular/router';
import { Article, ErrorResponse } from '@svv/core/models';
import { ArticlesQuery, ArticlesService } from '@svv/website/state/articles';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'articles',
  templateUrl: './articles.component.html',
  styleUrls: ['./articles.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArticlesComponent implements OnInit, OnDestroy {
  private readonly destroy$: Subject<void> = new Subject<void>();

  @Input() category: string;

  articles$: Observable<Article[]>;
  hasMore$: Observable<boolean>;
  loading$: Observable<boolean>;
  error$: Observable<ErrorResponse>;

  limit: number = 2;

  constructor(
    private router: Router,
    private articlesService: ArticlesService,
    private articlesQuery: ArticlesQuery,
  ) {}

  ngOnInit() {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.articles$ = this.articlesQuery.selectArticles(this.category);
    this.hasMore$ = this.articlesQuery.selectHasMore();
    this.loading$ = this.articlesQuery.selectLoading();
    this.error$ = this.articlesQuery.selectError();

    this.loadArticles(true);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadArticles(initial: boolean = false) {
    this.articlesService
      .getArticles(initial, this.limit, this.category)
      .pipe(takeUntil(this.destroy$))
      .subscribe();
  }

  trackByFn(index: number, article: Article) {
    return index;
  }

  emptyArray(n: number): any[] {
    return Array(n);
  }
}
