import { Model } from 'mongoose';
import { Inject, Injectable } from '@nestjs/common';
import { IMAGE_TAG_MODEL } from '@svv/api/core/constants';
import { ImageTag } from '@svv/api/images/interfaces';
import { CreateImageTagDto, UpdateImageTagDto } from '@svv/api/images/dtos';

@Injectable()
export class ImageTagsService {
  constructor(@Inject(IMAGE_TAG_MODEL) private tagModel: Model<ImageTag>) {}

  /**
   * Retrieves all `Image Tags` from the database, sorts them by thier position
   * and finally returns them.
   */
  findAll() {
    return this.tagModel.find().exec();
  }

  /**
   * Retrieves the `Image Tag` which is associated with the given id and returns it.
   *
   * @param id The id of the `Image Tag`.
   */
  findOne(id: string) {
    return this.tagModel.findOne({ _id: id });
  }

  findTotal() {
    return this.tagModel.countDocuments().exec();
  }

  /**
   * Creates a new `Image Tag` based on the given parameters and returns it after
   * a successful creation.
   *
   * @param createImageDto The class which contains the validated variables
   * for creating the new `Image Tag`.
   */
  async createOne(createImageTagDto: CreateImageTagDto) {
    const createdImageTag = new this.tagModel(createImageTagDto);
    return createdImageTag.save();
  }

  /**
   * Retrieves a `Image Tag` based on the given id, updates it with the changes
   * and returns the modified document.
   *
   * @param id The id of the `Image Tag`.
   *
   * @param changes The class which contains the validated variables for updating
   * the existing `Image Tag`.
   */
  updateOne(id: string, changes: UpdateImageTagDto) {
    return this.tagModel.findOneAndUpdate(
      { _id: id },
      { $set: changes },
      { new: true },
    );
  }

  /**
   * Deletes a `Image Tag` based on the given id.
   *
   * @param id The id of the `Image Tag`.
   */
  deleteOne(id: string) {
    return this.tagModel.findOneAndRemove({ _id: id });
  }
}
