import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { Article } from '@svv/core/models';

export interface ArticlesState extends EntityState<Article, string> {
  currentLimit: number;
  hasMore: boolean;
}

@Injectable({
  providedIn: 'root',
})
@StoreConfig({ name: 'articles', idKey: '_id', resettable: true })
export class ArticlesStore extends EntityStore<ArticlesState> {
  constructor() {
    super({
      loading: true,
      hasMore: false,
      currentLimit: 0,
    });
  }
}
