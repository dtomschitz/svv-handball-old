import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { switchMap } from 'rxjs/operators';
import { ArticlesState, ArticlesStore } from './articles.store';

@Injectable({
  providedIn: 'root',
})
export class ArticlesQuery extends QueryEntity<ArticlesState> {
  constructor(protected store: ArticlesStore) {
    super(store);
  }

  selectPinnedArticles() {
    return this.selectAll({
      filterBy: article => article.pinned === true,
    });
  }

  selectArticles(category?: string) {
    return this.selectCurrentLimit().pipe(
      switchMap(currentLimit => {
        return this.selectAll({
          limitTo: currentLimit,
          filterBy: [
            article => article.pinned === false,
            ...(category
              ? [article => article.categoryIds.includes(category)]
              : []),
          ],
        });
      }),
    );
  }

  selectCurrentLimit() {
    return this.select(state => state.currentLimit);
  }

  selectHasMore() {
    return this.select(state => state.hasMore);
  }
}
