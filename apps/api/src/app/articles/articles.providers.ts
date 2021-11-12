import { Connection } from 'mongoose';
import {
  ARTICLE_CATEGORY_MODEL,
  ARTICLE_MODEL,
  DATABASE_CONNECTION,
} from '@svv/api/core/constants';
import { ArticleSchema, ArticleCategorySchema } from './schemas';

/**
 * This provider defines the `Article` Model for the current connection.
 */
export const articleProvider = {
  provide: ARTICLE_MODEL,
  useFactory: (connection: Connection) =>
    connection.model('Article', ArticleSchema, 'articles'),
  inject: [DATABASE_CONNECTION],
};

/**
 * This provider defines the `Article Category` Model for the current connection.
 */
export const articleCategoryProvider = {
  provide: ARTICLE_CATEGORY_MODEL,
  useFactory: (connection: Connection) =>
    connection.model(
      'ArticleCategory',
      ArticleCategorySchema,
      'article_categories',
    ),
  inject: [DATABASE_CONNECTION],
};

/**
 * The default providers for the `Articles` and `Article Categories` feature.
 */
export const articlesProviders = [articleProvider, articleCategoryProvider];
