import { HttpService, Inject, Injectable, Logger } from '@nestjs/common';
import { HvwResponse, HvwCachingType } from '@svv/core/models';
import { AppConfigService } from '@svv/api/core/config/app';
import { HVW_GAME_MODEL } from '@svv/api/core/constants';
import { CreateHvwGameDto } from '@svv/api/hvw/dtos';
import { HvwGame } from '@svv/api/hvw/interfaces';
import { HvwClassService } from './hvw-class.service';
import { HvwWeeksService } from './hvw-weeks.service';
import { HvwCachingResultService } from './hvw-caching-result.service';
import { HvwCachingService } from './hvw-caching.service';
import { Model } from 'mongoose';
import * as customParseFormat from 'dayjs/plugin/customParseFormat';
import * as dayjs from 'dayjs';

dayjs.extend(customParseFormat);

@Injectable()
export class HvwGamesService implements HvwCachingService {
  private readonly logger = new Logger(HvwGamesService.name);

  constructor(
    @Inject(HVW_GAME_MODEL) private gameModel: Model<HvwGame>,
    private httpService: HttpService,
    private configService: AppConfigService,
    private weeksService: HvwWeeksService,
    private classesService: HvwClassService,
    private cachingResultsService: HvwCachingResultService,
  ) {}

  /**
   * Retrieves all `Games` from the database and returns them.
   */
  findAll() {
    return this.gameModel
      .find()
      .populate('class', 'id shortName longName')
      .exec();
  }

  /**
   * Retrieves all `Games` which are associated with the given classId
   * and returns them.
   *
   * @param classId The id of the `Class`.
   */
  async findAllByClassId(classId: string) {
    const hvwClass = await this.classesService.findOne(classId);

    return this.gameModel
      .find({ classId: hvwClass._id })
      .populate('class', 'id shortName longName')
      .exec();
  }

  /**
   * Retrieves all `Games` which will take place in the given week
   * and returns them.
   *
   * @param week The date of the week.
   */
  async findAllByWeek(week?: string) {
    const games = await this.gameModel
      .find({ week })
      .populate('class', 'shortName longName')
      .populate('team', 'name abbreviation positio type')
      .exec();

    const days: { [key: string]: HvwGame[] } = games.reduce((days, game) => {
      const date = game.date;

      if (!days[date]) {
        days[date] = [];
      }

      days[date].push(game);
      return days;
    }, {});

    const format = 'DD.MM.YYYY';
    return Object.keys(days)
      .sort((a, b) => (dayjs(a, format).isAfter(dayjs(b, format)) ? 1 : -1))
      .map(date => {
        return {
          date,
          games: days[date].sort(
            (a, b) => a?.team?.position - b?.team?.position,
          ),
        };
      });
  }

  /**
   * Updates a or creates a list of `HvwGames` based
   * on the given createHvwGameDtos.
   *
   * @param createHvwGameDtos The classes which contains the validated variables
   * for creating the new `HvwGames`.
   */
  createOrUpdateMany(createHvwGameDtos: CreateHvwGameDto[]) {
    const writes = createHvwGameDtos.map(createHvwGamekDto => {
      return {
        updateOne: {
          filter: { id: createHvwGamekDto.id },
          update: { $set: createHvwGamekDto },
          upsert: true,
        },
      };
    });

    return this.gameModel.bulkWrite(writes);
  }

  /**
   * Removes all `HVW Games` from the database.
   */
  deleteAll() {
    return this.gameModel.deleteMany({});
  }

  /**
   * Starts the caching process of all `Games`
   *
   * @param userId The id of the `User` who started the caching process.
   * @deprecated
   */
  async cache(userId?: string) {
    const startTime = process.hrtime();
    const createHvwGameDtos: CreateHvwGameDto[] = [];

    let weeks = await this.weeksService.findAll();
    if (weeks.length === 0) {
      this.logger.warn(
        `Caching the games will be scheduled because no weeks are saved`,
      );
      await this.weeksService.cache();
      weeks = await this.weeksService.findAll();
    }

    for (const week of weeks) {
      const response = await this.httpService
        .get<[HvwResponse]>(
          `${this.configService.HVW_API_URL}?c=210&cmd=pcu&og=3&do=${week.date}`,
        )
        .toPromise();

      const classes = await Promise.all(
        response.data[0].content.classes.map(async ({ gClassID, games }) => {
          const clazz = await this.classesService.findOneById(gClassID);
          return { classId: clazz._id, games };
        }),
      );

      const games = ([] as CreateHvwGameDto[]).concat(
        ...classes.map(({ classId, games }) => {
          return games.map<CreateHvwGameDto>(game => {
            return {
              id: game.gID,
              no: game.gNo,
              sGId: game.sGID,
              appId: game.gAppID,
              classId,
              comment: game.gComment,
              referee: game.gReferee,
              groupsortTxt: game.gGroupsortTxt,
              date: dayjs(`${game.gDate}`, 'DD.MM.YY').format('DD.MM.YYYY'),
              time: game.gTime,
              week: week.date,
              weekDay: game.gWDay,
              live: !!game.live,
              gymnasium: {
                id: game.gGymnasiumID,
                no: game.gGymnasiumNo,
                name: game.gGymnasiumName,
                postal: game.gGymnasiumPostal,
                street: game.gGymnasiumStreet,
                town: game.gGymnasiumTown,
              },
              teams: {
                home: {
                  name: game.gHomeTeam,
                  goals: game.gHomeGoals,
                  goals_1: game.gHomeGoals_1,
                  points: game.gHomePoints,
                },
                guest: {
                  name: game.gGuestTeam,
                  goals: game.gGuestGoals,
                  goals_1: game.gGuestGoals_1,
                  points: game.gGuestPoints,
                },
              },
            };
          });
        }),
      );

      createHvwGameDtos.push(...games);
    }

    const { result } = await this.createOrUpdateMany(createHvwGameDtos);
    const endTime = process.hrtime(startTime);

    if (result.ok !== 1) {
      this.logger.error(`Failed to cache games (${endTime[0]}s)`);
    } else {
      this.logger.log(
        `Cached ${createHvwGameDtos.length} games (${endTime[0]}s)`,
      );
    }

    return this.cachingResultsService.createOne({
      type: HvwCachingType.GAMES,
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
