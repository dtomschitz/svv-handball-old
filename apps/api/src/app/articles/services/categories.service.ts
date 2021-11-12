import { Model } from 'mongoose';
import { Inject, Injectable } from '@nestjs/common';
import { ARTICLE_CATEGORY_MODEL } from '@svv/api/core/constants';
import { ArticleCategory } from '../interfaces';
import { CreateCategoryDto, UpdateCategoryDto } from '../dtos';
import { ArticlesService } from './articles.service';

@Injectable()
export class ArticleCategoriesService {
  constructor(
    @Inject(ARTICLE_CATEGORY_MODEL)
    private categoryModel: Model<ArticleCategory>,
    private articlesService: ArticlesService,
  ) {}

  /**
   * Retrieves all `Article Categories` from the database and returns them.
   */
  findAll() {
    return this.categoryModel.find().exec();
  }

  /**
   * Retrieves the `Article Category` which is associated with the given id from
   * the  database.
   *
   * @param id The id of the `Article Category`.
   */
  findOne(id: string) {
    return this.categoryModel.findOne({ _id: id });
  }

  /**
   * Creates a new `Article Category` based on the given parameters and returns
   * it after a successful creation.
   *
   * @param createCategoryDto The class which contains the validated variables
   * for creating the new `Article Category`.
   */
  createOne(createCategoryDto: CreateCategoryDto) {
    const createdCategory = new this.categoryModel(createCategoryDto);
    return createdCategory.save();
  }

  /**
   * Retrieves a `Article Category` based on the given id, updates it with the
   * changes and returns the modified document.
   *
   * @param id The id of the `Article Category`.
   *
   * @param changes The class which contains the validated variables for
   * updating the existing `Article Category`.
   */
  updateOne(id: string, changes: UpdateCategoryDto) {
    return this.categoryModel.findOneAndUpdate(
      { _id: id },
      { $set: changes },
      { new: true },
    );
  }

  /**
   * Deletes a `Article Category` based on the given id and removes the
   * id from all `Articles`.
   *
   * @param id The id of the `Article Category`.
   */
  async deleteOne(id: string) {
    const session = await this.categoryModel.startSession();
    session.startTransaction();

    try {
      await this.categoryModel.findOneAndRemove({ _id: id });
      await this.articlesService.removeCategoryId(id);

      await session.commitTransaction();
      session.endSession();

      return true;
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  }
}
