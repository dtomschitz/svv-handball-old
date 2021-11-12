import { Article } from './article.model';

export interface ArticlesResponse {
  articles: Article[];
  hasMore: boolean;
  total: number;
}
