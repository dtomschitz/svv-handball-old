import { forwardRef, Module } from '@nestjs/common';
import { DatabaseModule } from '@svv/api/core/database';
import { UsersModule } from '@svv/api/users';
import { ArticlesController } from './articles.controller';
import { articlesProviders } from './articles.providers';
import { ArticlesService, ArticleCategoriesService } from './services';

@Module({
  imports: [DatabaseModule, forwardRef(() => UsersModule)],
  controllers: [ArticlesController],
  providers: [ArticlesService, ArticleCategoriesService, ...articlesProviders],
  exports: [ArticlesService, ArticleCategoriesService],
})
export class ArticlesModule {}
