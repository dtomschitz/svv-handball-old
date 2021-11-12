import {
  Body,
  Controller,
  Delete,
  Get,
  Header,
  Param,
  Post,
  Put,
  UseFilters,
  UseGuards,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ErrorType, MulterStorageResponse } from '@svv/core/models';
import { TEAM_MODEL } from '@svv/api/core/constants';
import {
  MongooseExceptionFilter,
  ObjectNotFoundInterceptor,
  ValidateIdInterceptor,
} from '@svv/api/core/error';
import { MulterResults } from '@svv/api/core/multer';
import { JwtAuthGuard } from '@svv/api/auth/guards';
import { TeamsService } from '@svv/api/teams/services';
import { CreateTeamDto, UpdateTeamDto, UpdateTeamsDto } from './dtos';
import { teamsMulterOptions } from './teams-multer-options';

/**
 * Default interceptor for validating whether the specified id within the URL
 * is a valid `ObjectId` or not.
 */
const ValidateTeamIdInterceptor = ValidateIdInterceptor();

/**
 * Default interceptor for validating whether the created response is empty
 * or has content.
 */
const TeamsNotFoundInterceptor = ObjectNotFoundInterceptor(
  ErrorType.TEAMS_NOT_FOUND,
);

/**
 * Default interceptor for validating whether there is a `Team` stored in the
 * database which is associated with the given id of the URL or not.
 */
const TeamNotFoundInterceptor = ObjectNotFoundInterceptor(
  ErrorType.TEAM_NOT_FOUND,
);

/**
 * Default filter for catching unexpected errors from the database and creating
 * standardized error responses accordingly.
 */
const MongoDbExceptionFilter = new MongooseExceptionFilter({
  duplicate: ErrorType.DUPLICATE_TEAM,
});

/**
 * This class implements the controller functionality for the `Teams` feature
 * including all necessary endpoints which are accessd by the CMS application
 * and the website.
 *
 * All requests are checked for further validation before they get processed by
 * the respective method. The @param id gets validated and checked for
 * its existence in the `Teams` collection. Should the id be invalid the
 * `INVALID_OBJECT_ID` error will be thrown. In case there is no object
 * associated with given id the `TEAM_NOT_FOUND` or `TEAMS_NOT_FOUND` error
 * will be thrown.
 *
 * The controller also uses the `MongooseExceptionFilter` in order to catch
 * unexpected errors and generate the standardized error response.
 *
 * Some handler methods inside the controller are secured with the JWT
 * authentication mechanism. In order to access these routes the specific request
 * must contain a valid and not expired access token.
 */
@Controller('teams')
@UseFilters(MongoDbExceptionFilter)
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}

  /**
   * Retrieves all `Teams` from the database and returns them. The response is
   * also populated with `Users` and a `HvwClass` if the associated properties
   * are correctly linked.
   *
   * To prevent possible occurring errors on the client side the
   * `{ObjectNotFoundInterceptor}` is used for validating whether there are
   * `Teams` definied in the database or not. In case no `Teams` cloud be found
   * the `TEAMS_NOT_FOUND` error will be sent back.
   *
   * @throws The ApiException with the error type `TEAMS_NOT_FOUND` if no `Teams`
   * could be retrieved from the database.
   */
  @Get()
  @UseInterceptors(TeamsNotFoundInterceptor)
  getTeams() {
    return this.teamsService.findAll();
  }

  @Get('minimal')
  @UseInterceptors(TeamsNotFoundInterceptor)
  getTeamsInfo() {
    return this.teamsService.findMinimal();
  }

  /**
   * Returns the `Team` which is associated with the given abbreviation and
   * populates it with `Coaches` and a `HvwClass` if the associated properties
   * are correctly linked.
   *
   * The `ObjectNotFoundInterceptor` is used to check whether a `Team` with the
   * specified abbreviation exists. If this is not the case, the `TEAM_NOT_FOUND`
   * error will be send back.
   *
   * @param abbreviation The abbreviation of the `Team`.
   *
   * @throws The ApiException with the error type `TEAM_NOT_FOUND` if no `Team`
   * is associated with the given abbreviation.
   */
  @Get(':abbreviation')
  @UseInterceptors(
    ObjectNotFoundInterceptor(ErrorType.TEAM_NOT_FOUND, {
      modelToken: TEAM_MODEL,
      existsFn: request => ({ abbreviation: request.params.abbreviation }),
    }),
  )
  getTeam(@Param('abbreviation') abbreviation: string) {
    return this.teamsService.findOne(abbreviation);
  }

  /**
   * Creates a new `Team` based on the given parameters inside the body. These
   * parameters will be evaluated based on the decorators within
   * the `CreateTeamDto` class.
   *
   * If the there is already a `Team` with a identical abbreviation the
   * `DUPLICATE_TEAM` error will be thrown.
   *
   * This route is secured with the JWT authentication mechanism. In order to
   * access this route the request must contain a valid and not expired
   * access token.
   *
   * @param createTeamDto The class which contains the validated variables for
   * creating the new `Team`.
   *
   * @throws The ApiException with the error type `DUPLICATE_TEAM` if there
   * already exists a `Team` with the given name.
   */
  @Post()
  @UseGuards(JwtAuthGuard)
  createTeam(@Body('team', ValidationPipe) createTeamDto: CreateTeamDto) {
    return this.teamsService.createOne(createTeamDto);
  }

  /**
   * Retrieves a `Team` based on the given id and updates it with the parameters
   * inside the body. These parameters will be evaluated based on the decorators
   * within the `UpdateTeamDto` class.
   *
   * This route is secured with the JWT authentication mechanism. In order to
   * access this route the request must contain a valid and not expired
   * access token.
   *
   * If the there is already a `Team` with a identical abbreviation the
   * `DUPLICATE_TEAM` error will be thrown.
   *
   * To prevent possible errors with a invalid id, the `ValidateIdInterceptor`
   * is used, which validates the given id from the URL. If the id does not
   * correspond to a valid `ObjectId`, a response with the `INVALID_OBJECT_ID`
   * error is sent back to the client. If the id is valid, the request will be
   * processed further.
   *
   * In addition to the `ValidateIdInterceptor`, the `{ObjectNotFoundInterceptor}`
   * is used to check whether a `Team` with the specified id exists. If this is
   * not the case, the `TEAM_NOT_FOUND` error will be send back.
   *
   * @param id The id of the `Team`.
   *
   * @param updateTeamDto The class which contains the validated variables for
   * updating the existing `Team`.
   *
   * @throws The ApiException with the error type `INVALID_OBJECT_ID` if the URL
   * doesnt contain a valid `ObjectId`.
   *
   * @throws The ApiException with the error type `TEAM_NOT_FOUND` if no `Team`
   * is associated with the given id.
   *
   * @throws The ApiException with the error type `DUPLICATE_TEAM` if there
   * already exists a `Team` with the given name.
   */
  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(ValidateTeamIdInterceptor, TeamNotFoundInterceptor)
  updateTeam(
    @Body('changes', ValidationPipe) updateTeamDto: UpdateTeamDto,
    @Param('id') id: string,
  ) {
    return this.teamsService.updateOne(id, updateTeamDto);
  }

  /**
   * Updates a list of `Teams` based on the given ids and updates them with the
   * different update parameters inside the body. Each update will be evaluated
   * based on the decorators within the `UpdateTeamDto` class.
   *
   * In addition to the `ValidateIdInterceptor`, the `{ObjectNotFoundInterceptor}`
   * is used to check whether a `Team` with the specified id exists. If this is
   * not the case, the `TEAM_NOT_FOUND` error will be send back.
   *
   * @param updateTeamsDtos The class which contains the validated sub classes
   * for updating the existing `Teams`.
   */
  @Put()
  @UseGuards(JwtAuthGuard)
  updateTeams(
    @Body('updates', ValidationPipe) updateTeamsDtos: UpdateTeamsDto,
  ) {
    return this.teamsService.updateMany(updateTeamsDtos);
  }

  /**
   * Retrieves a `Team` based on the given id and uploads the given image within
   * the request body. The image gets proccess by the custom `Muler Storage` and
   * will be  resized in two different sizes in order to provide a better loading
   * speed when used on the website.
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
   * is used to check whether a `Team` with the specified id exists. If this is
   * not the case, the `TEAM_NOT_FOUND` error will be send back.
   *
   * @param id The id of the `Team`.
   *
   * @throws The ApiException with the error type `INVALID_OBJECT_ID` if the URL
   * doesnt contain a valid `ObjectId`.
   *
   * @throws The ApiException with the error type `TEAM_NOT_FOUND` if no `Team`
   * is associated with the given id.
   */
  @Post(':id/image')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('image', teamsMulterOptions))
  async uploadTeamImage(
    @Param('id') id: string,
    @MulterResults() multer: MulterStorageResponse,
  ) {
    const icon = multer.results[0];
    const small = multer.results[1];
    const big = multer.results[2];

    const updateTeamDto: UpdateTeamDto = {
      images: {
        icon: {
          path: icon.path,
          width: icon.width,
          height: icon.height,
        },
        small: {
          path: small.path,
          width: small.width,
          height: small.height,
        },
        big: {
          path: big.path,
          width: big.width,
          height: big.height,
        },
        updatedAt: new Date().toISOString(),
        disabled: false,
      },
    };

    await this.teamsService.updateOne(id, updateTeamDto);

    return {
      id,
      changes: updateTeamDto,
    };
  }

  /**
   * Retrieves a `Team` based on the given id and deletes all assoicated images.
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
   * is used to check whether a `Team` with the specified id exists. If this is
   * not the case, the `TEAM_NOT_FOUND` error will be send back.
   *
   * @param id The id of the `Team`.
   *
   * @throws The ApiException with the error type `INVALID_OBJECT_ID` if the URL
   * doesnt contain a valid `ObjectId`.
   *
   * @throws The ApiException with the error type `TEAM_NOT_FOUND` if no `Team`
   * is associated with the given id.
   */
  @Delete(':id/image')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(ValidateTeamIdInterceptor, TeamNotFoundInterceptor)
  deleteTeamImage(@Param('id') id: string) {
    return this.teamsService.deleteTeamImages(id);
  }

  /**
   * Deletes a `Team` based on the given id. If the `Team` has a picture which
   * is also stored in the database, an attempt will be made to delete it.
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
   * is used to check whether a `Team` with the specified id exists. If this is
   * not the case, the `TEAM_NOT_FOUND` error will be send back.
   *
   * @param id The id of the `Team`.
   *
   * @throws The ApiException with the error type `INVALID_OBJECT_ID` if the URL
   * doesnt contain a valid `ObjectId`.
   *
   * @throws The ApiException with the error type `TEAM_NOT_FOUND` if no `Team`
   * is associated with the given id.
   */
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(ValidateTeamIdInterceptor, TeamNotFoundInterceptor)
  deleteTeam(@Param('id') id: string) {
    return this.teamsService.deleteOne(id);
  }
}
