import { Inject, Injectable } from '@nestjs/common';
import { HvwCachingType } from '@svv/core/models';
import { HVW_CACHING_RESULT_MODEL } from '@svv/api/core/constants';
import { CreateHvwCachingResultDto } from '@svv/api/hvw/dtos';
import { HvwCachingResult } from '@svv/api/hvw/interfaces';
import { Model } from 'mongoose';

@Injectable()
export class HvwCachingResultService {
  constructor(
    @Inject(HVW_CACHING_RESULT_MODEL)
    private cachingResultModel: Model<HvwCachingResult>,
  ) {}

  /**
   * Retrieves all `Caching Results` from the database for the given
   * `Caching Type`, populates the results with `Users` if the associated
   * properties are correctly linked and finally returns them.
   */
  findAll(type: HvwCachingType) {
    return this.cachingResultModel
      .find({ type })
      .populate('user', '_id firstName lastName')
      .exec();
  }

  /**
   * Creates a new `Caching Result` based on the given parameters and returns
   * it after a successful creation.
   *
   * @param createCachingResultDto The class which contains the validated
   * variables for creating the new `Caching Result`.
   */
  async createOne(createCachingResultDto: CreateHvwCachingResultDto) {
    const createdCachingResult = await new this.cachingResultModel(
      createCachingResultDto,
    ).save();
    return createdCachingResult.populate('user');
  }
}
