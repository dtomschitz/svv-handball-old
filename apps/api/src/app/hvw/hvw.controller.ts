import {
  Body,
  CacheInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseFilters,
  UseGuards,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import {
  ErrorType,
  GameWeek,
  HvwCachingType,
  HvwSchedule,
  HvwTable,
} from '@svv/core/models';
import {
  MongooseExceptionFilter,
  ObjectNotFoundInterceptor,
  ValidateIdInterceptor,
} from '@svv/api/core/error';
import {
  HVW_CLASS_MODEL,
  HVW_JOB_MODEL,
  HVW_TABLE_MODEL,
} from '@svv/api/core/constants';
import { JwtAuthGuard } from '@svv/api/auth/guards';
import {
  HvwCachingResultService,
  HvwClassService,
  HvwGamesService,
  HvwJobsService,
  HvwTablesService,
  HvwWeeksService,
} from './services';
import { CreateHvwJobDto, UpdateHvwJobDto } from './dtos';

/**
 * Default interceptor for validating whether the created response is empty
 * or has content.
 */
const JobsNotFoundInterceptor = ObjectNotFoundInterceptor(
  ErrorType.JOBS_NOT_FOUND,
);

/**
 * Default interceptor for validating whether there is a `CronJob` stored in the
 * database which is associated with the given id of the URL or not.
 */
const JobNotFoundInterceptor = ObjectNotFoundInterceptor(
  ErrorType.JOB_NOT_FOUND,
  {
    modelToken: HVW_JOB_MODEL,
  },
);

/**
 * Default interceptor for validating whether there is a `Table` stored in the
 * database which is associated with the given classId of the URL or not.
 */
const TableNotFoundInterceptor = ObjectNotFoundInterceptor<HvwTable>(
  ErrorType.TABLE_NOT_FOUND,
  {
    modelToken: HVW_CLASS_MODEL,
    validationFn: data =>
      Array.isArray(data?.scores) && data.scores.length === 0,
  },
);

/**
 * Default interceptor for validating whether there is a `Schedule` stored in
 * the database for the specific team.
 */
const ScheduleNotFoundInterceptor = ObjectNotFoundInterceptor<HvwSchedule>(
  ErrorType.SCHEDULE_NOT_FOUND,
  {
    validationFn: data => Array.isArray(data.games) && data.games.length === 0,
  },
);

/**
 * Default filter for catching unexpected errors from the database and creating
 * standardized error responses accordingly.
 */
const MongoDbExceptionFilter = new MongooseExceptionFilter({
  duplicate: ErrorType.DUPLICATE_JOB,
});

/**
 * This class implements the controller functionality for the `HVW` feature
 * including all necessary endpoints which are accessd by the CMS application
 * and the website.
 *
 * The controller uses the `MongooseExceptionFilter` in order to catch
 * unexpected errors and generate the standardized error response.
 *
 * Some handler methods inside the controller are secured with the JWT
 * authentication mechanism. In order to access these routes the specific request
 * must contain a valid and not expired access token.
 */
@Controller('hvw')
@UseFilters(MongoDbExceptionFilter)
export class HvwController {
  constructor(
    private readonly weeksService: HvwWeeksService,
    private readonly classService: HvwClassService,
    private readonly gamesService: HvwGamesService,
    private readonly tablesService: HvwTablesService,
    private readonly cachingService: HvwCachingResultService,
    private readonly jobsService: HvwJobsService,
  ) {}

  /**
   * Retrieves all `Weeks` from the database and returns them.
   */
  @Get('games')
  getGames() {
    return this.gamesService.findAll();
  }

  /**
   * Retrieves all `Games` from the database which will take place within the
   * current week.
   */
  @Get('games/week')
  //@UseInterceptors(EncountersNotFoundInterceptor)
  getEncoutersByCurrentWeek() {
    return this.getEncounters();
  }

  /**
   * Retrieves all `Games` from the database which will take place within the
   * given week.
   */
  @Get('games/week/:week')
  getEncoutersByWeek(@Param('week') week: string) {
    return this.getEncounters(week);
  }

  private async getEncounters(week?: string) {
    const currentWeek = (await this.weeksService.findByCurrent()).date;
    if (!week) {
      week = currentWeek;
    }

    const weeks = await this.weeksService.findAll();
    const index = weeks.findIndex(({ date }) => date === week);
    const days = await this.gamesService.findAllByWeek(week);

    return {
      _id: week,
      weeks: {
        previous: weeks[index - 1]?.date,
        selected: week,
        current: currentWeek,
        next: weeks[index + 1]?.date,
      },
      days,
    };
  }

  /**
   * Retrieves all `Games` from the database which are associated with the given
   * `Class` id.
   *
   * @param classId The `Class` id which is associated with the `Table`.
   *
   * @throws The ApiException with the error type `SCHEDULE_NOT_FOUND` if no
   * `Schedule` could be retrieved from the database.
   */
  @Get('schedules/:classId')
  @UseInterceptors(ValidateIdInterceptor(), ScheduleNotFoundInterceptor)
  async getSchedule(@Param('classId') classId: string) {
    const games = await this.gamesService.findAllByClassId(classId);
    return {
      classId,
      games,
    };
  }

  /**
   * Retrieves all `Weeks` from the database and returns them.
   */
  @Get('weeks')
  getWeeks() {
    return this.weeksService.findAll();
  }

  /**
   * Retrieves all `Classes` from the database and returns them.
   */
  @Get('classes')
  getClasses() {
    return this.classService.findAll();
  }

  /**
   * Retrieves all `Tables` from the database and returns them.
   */
  @Get('tables')
  getTables() {
    return this.tablesService.findAll();
  }

  /**
   * Retrieves the `Table`from the database which is associated with the given
   * `Class` id  and returns the result.
   *
   * @param id The `Class` id which is associated with the `Table`.
   *
   * @throws The ApiException with the error type `TABLE_NOT_FOUND` if no
   * `HVW Table` could be retrieved from the database.
   */
  @Get('tables/:id')
  @UseInterceptors(ValidateIdInterceptor(), TableNotFoundInterceptor)
  getTable(@Param('id') id: string) {
    return this.tablesService.findOneByClassId(id);
  }

  /**
   * Retrieves all `Caching Results` for the caching type `Games`.
   */
  @Get('cache/games/results')
  @UseGuards(JwtAuthGuard)
  getGameCachingResults() {
    return this.cachingService.findAll(HvwCachingType.GAMES);
  }

  /**
   * Retrieves all `Caching Results` for the caching type `Weeks`.
   */
  @Get('cache/weeks/results')
  @UseGuards(JwtAuthGuard)
  getWeeksCachingResults() {
    return this.cachingService.findAll(HvwCachingType.WEEKS);
  }

  /**
   * Retrieves all `Caching Results` for the caching type `Classes`.
   */
  @Get('cache/classes/results')
  @UseGuards(JwtAuthGuard)
  getClassesCachingResults() {
    return this.cachingService.findAll(HvwCachingType.CLASSES);
  }

  /**
   * Retrieves all `Caching Results` for the caching type `Tables`.
   */
  @Get('cache/tables/results')
  @UseGuards(JwtAuthGuard)
  getTablesCachingResults() {
    return this.cachingService.findAll(HvwCachingType.TABLES);
  }

  /**
   * Retrieves all `CronJobs` from the database and returns them. The response
   * is also populated with `Users` and a `HvwClass` if the associated
   * properties are correctly linked.
   *
   * This route is secured with the JWT authentication mechanism. In order to
   * access this route the request must contain a valid and not expired
   * access token.
   *
   * To prevent possible occurring errors on the client side the
   * `{ObjectNotFoundInterceptor}` is used for validating whether there are
   * `CronJobs` definied in the database or not. In case no `CronJobs` cloud be
   * found the `JOBS_NOT_FOUND` error will be sent back.
   *
   * @throws The ApiException with the error type `JOBS_NOT_FOUND` if no
   * `CronJobs` could be retrieved from the database.
   */
  @Get('jobs')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(JobsNotFoundInterceptor)
  getJobs() {
    return this.jobsService.findAll();
  }

  /**
   * Creates a new `CronJob` based on the given parameters inside the body.
   * These parameters will be evaluated based on the decorators within the
   * `CreateHvwJobDto` class.
   *
   * If the there is already a `CronJob` with a identical abbreviation the
   * `DUPLICATE_JOB` error will be thrown.
   *
   * This route is secured with the JWT authentication mechanism. In order to
   * access this route the request must contain a valid and not expired
   * access token.
   *
   * @param createJobDto The class which contains the validated variables for
   * creating the new `CronJob`.
   *
   * @throws The ApiException with the error type `DUPLICATE_JOB` if there
   * already exists a `CronJob` with the given name.
   */
  @Post('jobs')
  @UseGuards(JwtAuthGuard)
  createJob(@Body('job', ValidationPipe) createJobDto: CreateHvwJobDto) {
    return this.jobsService.createOne(createJobDto);
  }

  /**
   * Retrieves a `CronJob` based on the given id and updates it with the parameters
   * inside the body. These parameters will be evaluated based on the decorators
   * within the `UpdateHvwJobDto` class.
   *
   * This route is secured with the JWT authentication mechanism. In order to
   * access this route the request must contain a valid and not expired
   * access token.
   *
   * If the there is already a `CronJob` with a identical abbreviation the
   * `DUPLICATE_JOB` error will be thrown.
   *
   * To prevent possible errors with a invalid id, the `ValidateIdInterceptor`
   * is used, which validates the given id from the URL. If the id does not
   * correspond to a valid `ObjectId`, a response with the `INVALID_OBJECT_ID`
   * error is sent back to the client. If the id is valid, the request will be
   * processed further.
   *
   * In addition to the `ValidateIdInterceptor`, the `{ObjectNotFoundInterceptor}`
   * is used to check whether a `CronJob` with the specified id exists. If this
   * is not the case, the `JOB_NOT_FOUND` error will be send back.
   *
   * @param id The id of the `CronJob`.
   *
   * @param updateJobDto The class which contains the validated variables for
   * updating the existing `CronJob`.
   *
   * @throws The ApiException with the error type `INVALID_OBJECT_ID` if the URL
   * doesnt contain a valid `ObjectId`.
   *
   * @throws The ApiException with the error type `JOB_NOT_FOUND` if no `CronJob`
   * is associated with the given id.
   *
   * @throws The ApiException with the error type `DUPLICATE_JOB` if there
   * already exists a `CronJob` with the given name.
   */
  @Put('jobs/:id')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(ValidateIdInterceptor(), JobNotFoundInterceptor)
  updateJob(
    @Body('changes', ValidationPipe) updateJobDto: UpdateHvwJobDto,
    @Param('id') id: string,
  ) {
    return this.jobsService.updateOne(id, updateJobDto);
  }

  /**
   * Deletes a `CronJob` based on the given id.
   *
   * This route is secured with the JWT authentication mechanism. In order to
   * access this route the request must contain a valid and not expired
   * access token.
   *
   * To prevent possible errors with a invalid id, the `ValidateIdInterceptor`
   * is used, which validates the given id from the URL. If the id does not
   * correspond to a valid `ObjectId`, a response with the `INVALID_OBJECT_ID`
   * error is sent back to the client. If the id is valid, the request will be
   * processed further.
   *
   * In addition to the `ValidateIdInterceptor`, the `{ObjectNotFoundInterceptor}`
   * is used to check whether a `CronJob` with the specified id exists. If this
   * is not the case, the `JOB_NOT_FOUND` error will be send back.
   *
   * @param id The id of the `CronJob`.
   *
   * @throws The ApiException with the error type `INVALID_OBJECT_ID` if the URL
   * doesnt contain a valid `ObjectId`.
   *
   * @throws The ApiException with the error type `JOB_NOT_FOUND` if no `CronJob`
   * is associated with the given id.
   */
  @Delete('jobs/:id')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(ValidateIdInterceptor(), JobNotFoundInterceptor)
  deleteJob(@Param('id') id: string) {
    return this.jobsService.deleteOne(id);
  }

  /**
   * Starts the caching process of the `Games` by accessing the HVW API.
   *
   * @param userId The id of the `User` who started the caching process.
   */
  @Post('cache/games')
  @UseGuards(JwtAuthGuard)
  cacheGames(@Body('userId') userId: string) {
    return this.gamesService.cache(userId);
  }

  /**
   * Starts the caching process of the `Weeks` by accessing the HVW API.
   *
   * @param userId The id of the `User` who started the caching process.
   */
  @Post('cache/weeks')
  @UseGuards(JwtAuthGuard)
  cacheWeeks(@Body('userId') userId: string) {
    return this.weeksService.cache(userId);
  }

  /**
   * Starts the caching process of the `Tables` by accessing the HVW API.
   *
   * @param userId The id of the `User` who started the caching process.
   */
  @Post('cache/tables')
  @UseGuards(JwtAuthGuard)
  cacheTables(@Body('userId') userId: string) {
    return this.tablesService.cache(userId);
  }

  /**
   * Starts the caching process of the `Classes` by accessing the HVW API.
   *
   * @param userId The id of the `User` who started the caching process.
   */
  @Post('cache/classes')
  @UseGuards(JwtAuthGuard)
  cacheClasses(@Body('userId') userId: string) {
    return this.classService.cache(userId);
  }

  /**
   * Removes all `HVW Games` from the database.
   */
  @Delete('games')
  deleteGames() {
    return this.gamesService.deleteAll();
  }

  /**
   * Removes all `HVW Tables` from the database.
   */
  @Delete('tables')
  deleteTables() {
    return this.tablesService.deleteAll();
  }

  /**
   * Removes all `HVW Weeks` from the database.
   */
  @Delete('weeks')
  deleteWeeks() {
    return this.weeksService.deleteAll();
  }

  /**
   * Removes all `HVW Classes` from the database.
   */
  @Delete('classes')
  deleteClasses() {
    return this.classService.deleteAll();
  }
}
