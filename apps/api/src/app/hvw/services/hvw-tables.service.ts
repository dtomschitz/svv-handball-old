import { HttpService, Inject, Injectable, Logger } from '@nestjs/common';
import { Model } from 'mongoose';
import { HvwCachingType, HvwResponse } from '@svv/core/models';
import { AppConfigService } from '@svv/api/core/config/app';
import { HVW_TABLE_MODEL } from '@svv/api/core/constants';
import { CreateHvwTableDto } from '@svv/api/hvw/dtos';
import { HvwTable } from '@svv/api/hvw/interfaces';
import { HvwClassService } from './hvw-class.service';
import { HvwCachingResultService } from './hvw-caching-result.service';
import { HvwCachingService } from './hvw-caching.service';

@Injectable()
export class HvwTablesService implements HvwCachingService {
  private readonly logger = new Logger(HvwTablesService.name);

  constructor(
    @Inject(HVW_TABLE_MODEL) private tableModel: Model<HvwTable>,
    private httpService: HttpService,
    private configService: AppConfigService,
    private hvwClassService: HvwClassService,
    private cachingResultsService: HvwCachingResultService,
  ) {}

  /**
   * Retrieves all `Tables` from the database and returns them.
   */
  findAll() {
    return this.tableModel
      .find()
      .populate('class', 'id shortName longName')
      .exec();
  }

  /**
   * Retrieves the `Table` which is associated with the given classId
   * and returns it.
   *
   * @param id The id of the `Class`.
   */
  async findOneByClassId(id: string) {
    const hvwClass = await this.hvwClassService.findOne(id);
    return this.tableModel.findOne({ classId: hvwClass._id }).exec();
  }

  /**
   * Updates a or creates a list of `Tables` based on the given createHvwTableDtos.
   *
   * @param createHvwTableDtos The classes which contains the validated variables
   * for creating the new `Tables`.
   */
  createOrUpdateMany(createHvwTableDtos: CreateHvwTableDto[]) {
    const writes = createHvwTableDtos.map(createHvwTableDto => {
      return {
        updateOne: {
          filter: { classId: createHvwTableDto.classId },
          update: { $set: createHvwTableDto },
          upsert: true,
        },
      };
    });

    return this.tableModel.bulkWrite(writes);
  }

  /**
   * Removes all `HVW Tables` from the database.
   */
  deleteAll() {
    return this.tableModel.deleteMany({});
  }

  /**
   * Starts the caching process of the `Tables`.
   *
   * @param userId The id of the `User` who started the caching process.
   * @deprecated
   */
  async cache(userId?: string) {
    const startTime = process.hrtime();
    const classes = await this.hvwClassService.findAll();

    if (classes.length === 0) {
      this.logger.warn(
        `Caching the tables is skipped because no classes are saved`,
      );
      return;
    }

    const createHvwTableDtos: CreateHvwTableDto[] = [];

    for (const { _id, id: classId } of classes) {
      const scores = (
        await this.httpService
          .get<[HvwResponse]>(
            `${this.configService.HVW_API_URL}?ca=0&cl=${classId}&cmd=ps&og=3`,
          )
          .toPromise()
      ).data[0].content.score;

      createHvwTableDtos.push({
        classId: _id,
        scores: scores.map(score => ({
          position: score.tabScore,
          teamName: score.tabTeamname,
          games: {
            won: score.numWonGames,
            equal: score.numEqualGames,
            lost: score.numLostGames,
            played: score.numPlayedGames,
          },
          goals: {
            got: score.numGoalsGot,
            shot: score.numGoalsShot,
          },
          points: {
            plus: score.pointsPlus,
            minus: score.pointsMinus,
          },
          liveTeam: score.liveTeam,
        })),
      });
    }

    const { result } = await this.createOrUpdateMany(createHvwTableDtos);
    const endTime = process.hrtime(startTime);

    if (result.ok !== 1) {
      this.logger.error(`Failed to cache tables (${endTime[0]}s)`);
    } else {
      this.logger.log(
        `Cached ${createHvwTableDtos.length} tables (${endTime[0]}s)`,
      );
    }

    return this.cachingResultsService.createOne({
      type: HvwCachingType.TABLES,
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
