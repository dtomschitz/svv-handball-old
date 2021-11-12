import { HttpService, Inject, Injectable, Logger } from '@nestjs/common';
import { Model } from 'mongoose';
import { AppConfigService } from '@svv/api/core/config/app';
import { HVW_WEEK_MODEL } from '@svv/api/core/constants';
import { HvwCachingType, HvwResponse } from '@svv/core/models';
import { CreateHvwWeekDto } from '@svv/api/hvw/dtos';
import { HvwWeek } from '@svv/api/hvw/interfaces';
import { HvwCachingResultService } from './hvw-caching-result.service';
import { HvwCachingService } from './hvw-caching.service';

@Injectable()
export class HvwWeeksService implements HvwCachingService {
  private readonly logger = new Logger(HvwWeeksService.name);

  constructor(
    @Inject(HVW_WEEK_MODEL) private weekModel: Model<HvwWeek>,
    private httpService: HttpService,
    private configService: AppConfigService,
    private cachingResultsService: HvwCachingResultService,
  ) {}

  /**
   * Retrieves all `Weeks` from the database and returns them.
   */
  findAll() {
    return this.weekModel.find().exec();
  }

  /**
   * Retrieves the current `Week` and returns it.
   */
  findByCurrent() {
    return this.weekModel.findOne({ current: true }).exec();
  }

  /**
   * Creates a new `HvwWeek` based on the given parameters and returns it after
   * a successful creation.
   *
   * @param createWeekDto The class which contains the validated variables for
   * creating the new `HVW Week`.
   */
  create(createWeekDto: CreateHvwWeekDto) {
    const createdWeek = new this.weekModel(createWeekDto);
    return createdWeek.save();
  }

  /**
   * Updates a or creates a list of `HvwWeeks` based on the given createWeekDtos.
   *
   * @param createWeekDto The classes which contains the validated variables for
   * creating the new `HVWWeeks`.
   */
  createOrUpdateMany(createWeekDtos: CreateHvwWeekDto[]) {
    const writes = createWeekDtos.map(createWeekDto => {
      return {
        updateOne: {
          filter: { date: createWeekDto.date },
          update: { $set: createWeekDto },
          upsert: true,
        },
      };
    });

    return this.weekModel.bulkWrite(writes);
  }

  /**
   * Removes all `HVW Weeks` from the database.
   */
  deleteAll() {
    return this.weekModel.deleteMany({});
  }

  /**
   * Starts the caching process of all `Weeks` in which the `Games`of the season
   * will take place.
   *
   * @param userId The id of the `User` who started the caching process.
   * @deprecated
   */
  async cache(userId?: string) {
    const startTime = process.hrtime();

    const data = (
      await this.httpService
        .get<[HvwResponse]>(
          `${this.configService.HVW_API_URL}?c=210&cmd=pcu&og=3`,
        )
        .toPromise()
    ).data[0].menu.dt;
    const dates = data.list;
    const selectedDate = data.selected;
    const createHvwWeekDtos = Object.keys(dates).map<CreateHvwWeekDto>(
      week => ({
        date: week,
        current: selectedDate === week,
      }),
    );

    const { result } = await this.createOrUpdateMany(createHvwWeekDtos);
    const endTime = process.hrtime(startTime);

    if (result.ok !== 1) {
      this.logger.error(`Failed to cache weeks (${endTime[0]}s)`);
    } else {
      this.logger.log(
        `Cached ${createHvwWeekDtos.length} weeks (${endTime[0]}s)`,
      );
    }

    return this.cachingResultsService.createOne({
      type: HvwCachingType.WEEKS,
      status: result.ok,
      neededTime: endTime[0].toString(),
      inserted: result.nInserted,
      upserted: result.nUpserted,
      matched: result.nMatched,
      modified: result.nModified,
      removed: result.nRemoved,
      userId,
    });
  }
}
