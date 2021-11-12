import { Model } from 'mongoose';
import { Inject, Injectable } from '@nestjs/common';
import { IMAGE_MODEL } from '@svv/api/core/constants';
import { Image } from '@svv/api/images/interfaces';
import { CreateImageDto, UpdateImageDto } from '@svv/api/images/dtos';

@Injectable()
export class ImagesService {
  constructor(@Inject(IMAGE_MODEL) private imageModel: Model<Image>) {}

  /**
   * Retrieves all `Images` from the database, sorts them by thier position
   * and finally returns them.
   */
  findAll() {
    return this.imageModel.find().exec();
  }

  /**
   * Retrieves the `Image` which is associated with the given id and returns it.
   *
   * @param id The id of the `Image`.
   */
  findOne(id: string) {
    return this.imageModel.findOne({ _id: id });
  }

  findTotal() {
    return this.imageModel.countDocuments().exec();
  }

  /**
   * Creates a new `Image` based on the given parameters and returns it after
   * a successful creation.
   *
   * @param createImageDto The class which contains the validated variables
   * for creating the new `Image`.
   */
  async createOne(createImageDto: CreateImageDto) {
    const createdImage = new this.imageModel(createImageDto);
    return createdImage.save();
  }

  /**
   * Retrieves a `Image` based on the given id, updates it with the changes
   * and returns the modified document.
   *
   * @param id The id of the `Image`.
   *
   * @param changes The class which contains the validated variables for updating
   * the existing `Image`.
   */
  updateOne(id: string, changes: UpdateImageDto) {
    return this.imageModel.findOneAndUpdate(
      { _id: id },
      { $set: changes },
      { new: true },
    );
  }

  /**
   * Deletes a `Image` based on the given id.
   *
   * @param id The id of the `Image`.
   */
  deleteOne(id: string) {
    return this.imageModel.findOneAndRemove({ _id: id });
  }
}
