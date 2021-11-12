import { ArticleAuthor } from './article-author.model';
import { ArticleCategory } from './article-category.model';

export interface Article {
  _id: string;
  date: string;
  title: string;
  subtitle?: string;
  content: string;
  categoryIds: string[];
  categories?: ArticleCategory[];
  authorIds: string[];
  authors?: ArticleAuthor[];
  pinned?: boolean;
  disabled?: boolean;
  readMore?: boolean;
}
