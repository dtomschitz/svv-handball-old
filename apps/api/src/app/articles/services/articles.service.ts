import { Model } from 'mongoose';
import { Inject, Injectable } from '@nestjs/common';
import { ARTICLE_MODEL } from '@svv/api/core/constants';
import { Article } from '../interfaces';
import { CreateArticleDto, UpdateArticleDto, ListAllArticles } from '../dtos';
import { Types } from 'mongoose';
import { ApiException } from '@svv/api/core/error';
import { ErrorType } from '@svv/core/models';

@Injectable()
export class ArticlesService {
  constructor(@Inject(ARTICLE_MODEL) private articleModel: Model<Article>) {}

  /**
   * Retrieves all `Articles` from the database, populates the results with
   * `Article Categories`, the `Authors` and the associated `Team` if there is
   * one and the properties are correctly linked.
   */
  async findAll(query: ListAllArticles) {
    const filter: any = {};
    if (query.pinned) {
      filter.pinned = true;
    }

    if (query.category) {
      if (!Types.ObjectId.isValid(query.category)) {
        throw new ApiException(ErrorType.ARTICLES_NOT_FOUND);
      }

      filter.categoryIds = query.category;
    }

    const articles = await this.articleModel
      .find(filter)
      .sort({ date: -1 })
      .populate('categories', '_id name')
      .populate('authors', '_id firstName lastName')
      .limit(+query.limit)
      .skip(+query.skip)
      .exec();

    if (query.checkNext) {
      return {
        articles,
        hasMore: true,
      };
    }

    return articles;
  }

  /**
   * Retrieves the `Article` which is associated with the given id from the
   * database.
   *
   * @param id The id of the `Article`.
   */
  findOne(id: string) {
    return this.articleModel.findOne({ _id: id }).exec();
  }

  findTotal() {
    return this.articleModel.countDocuments().exec();
  }

  /**
   * Creates a new `Article` based on the given parameters and returns it after
   * a successful creation.
   *
   * @param createArticleDto The class which contains the validated variables
   * for creating the new `Article`.
   */
  createOne(createArticleDto: CreateArticleDto) {
    const createdArticle = new this.articleModel(createArticleDto);
    return createdArticle.save();
  }

  /**
   * Retrieves a `Article` based on the given id, updates it with the changes
   * and returns the modified document.
   *
   * @param id The id of the `Article`.
   *
   * @param changes The class which contains the validated variables for
   * updating the existing `Article`.
   */
  updateOne(id: string, changes: UpdateArticleDto) {
    return this.articleModel.findOneAndUpdate(
      { _id: id },
      { $set: changes },
      { new: true },
    );
  }

  /**
   * Removes the given id of the delete `User` from the `Articles` which contains
   * the id inside the `authorIds` array.
   * 
   * @param id The id of the deleted `User`.
   */
  removeAuthorId(id: string) {
    return this.articleModel.updateMany(
      { authorIds: id },
      { $pullAll: { authorIds: [id] } },
    );
  }

  /**
   * Removes the given id of the delete `Article Category` from the `Articles`
   * which contain the id inside the `categoryIds` array.
   * 
   * @param id The id of the deleted `Article Category`.
   */
  removeCategoryId(id: string) {
    return this.articleModel.updateMany(
      { categoryIds: id },
      { $pullAll: { categoryIds: [id] } },
    );
  }

  /**
   * Deletes a `Article` based on the given id.
   *
   * @param id The id of the `Article`.
   */
  deleteOne(id: string) {
    return this.articleModel.findOneAndRemove({ _id: id });
  }
}
