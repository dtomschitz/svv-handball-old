import { HttpService, Inject, Injectable, Logger } from '@nestjs/common';
import { HvwResponse, HvwCachingType } from '@svv/core/models';
import { AppConfigService } from '@svv/api/core/config/app';
import { HVW_CLASS_MODEL } from '@svv/api/core/constants';
import { CreateHvwClassDto } from '@svv/api/hvw/dtos';
import { HvwClass } from '@svv/api/hvw/interfaces';
import { HvwCachingResultService } from './hvw-caching-result.service';
import { HvwCachingService } from './hvw-caching.service';
import { Model } from 'mongoose';

const youthClassRegex = /(männliche Jugend|weibliche Jugend|gemischte Jugend) ([A-z])/;
const activeClassRegex = /(Männer |Frauen )/;

@Injectable()
export class HvwClassService implements HvwCachingService {
  private readonly logger = new Logger(HvwClassService.name);

  constructor(
    @Inject(HVW_CLASS_MODEL) private classModel: Model<HvwClass>,
    private httpService: HttpService,
    private configService: AppConfigService,
    private cachingResultsService: HvwCachingResultService,
  ) {}

  /**
   * Retrieves all `Classes` from the database and returns them.
   */
  findAll() {
    return this.classModel.find().exec();
  }

  /**
   * Retrieves the `Class` which is associated with the given id from the
   * database and returns the result.
   *
   * @param id The id of the `Class`.
   */
  findOne(id: string) {
    return this.classModel.findOne({ _id: id }).exec();
  }

  /**
   * Retrieves the `Class` which is associated with the given id from the
   * database and returns the result.
   *
   * @param id The id of the `Class`.
   */
  findOneById(id: string) {
    return this.classModel.findOne({ id }).exec();
  }

  /**
   * Updates a or creates a list of `HvwClasses` based on the
   * given createHvwClassDtos.
   *
   * @param createHvwClassDtos The classes which contains the validated
   * variables for creating the new `HvwClasses`.
   */
  async createOrUpdateMany(createHvwClassDtos: CreateHvwClassDto[]) {
    const writes = createHvwClassDtos.map(createHvwClassDto => {
      return {
        updateOne: {
          filter: { id: createHvwClassDto.id },
          update: {
            $set: createHvwClassDto,
          },
          upsert: true,
        },
      };
    });

    return this.classModel.bulkWrite(writes);
  }

  /**
   * Removes all `HVW Class` from the database.
   */
  deleteAll() {
    return this.classModel.deleteMany({});
  }

  /**
   * Starts the caching process of all `Classes`.
   *
   * @param userId The id of the `User` who started the caching process.
   * @deprecated
   */
  async cache(userId?: string) {
    const startTime = process.hrtime();

    const classes = (
      await this.httpService
        .get<[HvwResponse]>(
          `${this.configService.HVW_API_URL}?c=210&cmd=pcu&og=3`,
        )
        .toPromise()
    ).data[0].content.classes;

    const createHvwClassDtos = classes.map<CreateHvwClassDto>(
      createHvwClassDto => {
        const { gClassID, gClassSname, gClassLname } = createHvwClassDto;

        return {
          id: gClassID,
          shortName: gClassSname,
          longName: gClassLname.includes('Jugend')
            ? gClassLname.replace(youthClassRegex, '').substring(1)
            : gClassLname.replace(activeClassRegex, ''),
        };
      },
    );

    const { result } = await this.createOrUpdateMany(createHvwClassDtos);
    const endTime = process.hrtime(startTime);

    if (result.ok !== 1) {
      this.logger.error(`Failed to cache classes (${endTime[0]}s)`);
    } else {
      this.logger.log(
        `Cached ${createHvwClassDtos.length} classes (${endTime[0]}s)`,
      );
    }

    return this.cachingResultsService.createOne({
      type: HvwCachingType.CLASSES,
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
