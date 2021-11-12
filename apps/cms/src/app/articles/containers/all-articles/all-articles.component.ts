import { ChangeDetectionStrategy, Component } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Article } from '@svv/core/models';
import * as fromArticle from '@svv/cms/articles/store/reducers';

/**
 * This component is used to display the `Articles` data table.
 */
@Component({
  selector: 'all-articles',
  templateUrl: './all-articles.component.html',
  styleUrls: ['./all-articles.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AllArticlesComponent {
  articles$: Observable<Article[]>;

  constructor(private store: Store<fromArticle.State>) {
    this.articles$ = this.store.pipe(select(fromArticle.selectAllArticles));
  }
}
