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
import {
  MongooseExceptionFilter,
  ObjectNotFoundInterceptor,
  ValidateIdInterceptor,
} from '@svv/api/core/error';
import { SPONSOR_MODEL } from '@svv/api/core/constants';
import { JwtAuthGuard } from '@svv/api/auth/guards';
import { SponsorsService } from '@svv/api/sponsors/services';
import { CreateSponsorDto, UpdateSponsorDto, UpdateSponsorsDto } from './dtos';
import { sponsorsMulterOptions } from './sponsors-multer-options';
import { MulterResults } from '../core/multer';

/**
 * Default interceptor for validating whether the specified id within the URL
 * is a valid `ObjectId` or not.
 */
const ValidateSponsorIdInterceptor = ValidateIdInterceptor();

/**
 * Default interceptor for validating whether the created response is empty
 * or has content.
 */
const SponsorsNotFoundInterceptor = ObjectNotFoundInterceptor(
  ErrorType.SPONSORS_NOT_FOUND,
);

/**
 * Default filter for catching unexpected errors from the database and creating
 * standardized error responses accordingly.
 */
const SponsorNotFoundInterceptor = ObjectNotFoundInterceptor(
  ErrorType.SPONSOR_NOT_FOUND,
  {
    modelToken: SPONSOR_MODEL,
  },
);

/**
 * Default filter for catching unexpected errors from the database and creating
 * standardized error responses accordingly.
 */
const MongoDbExceptionFilter = new MongooseExceptionFilter({
  duplicate: ErrorType.DUPLICATE_SPONSOR,
});

/**
 * This class implements the controller functionality for the `Sponsors` feature
 * including all necessary endpoints which are access by the CMS application
 * and the website.
 *
 * All requests are checked for further validation before they get processed by
 * the respective method. The @param id gets validated and checked for
 * its existence in the `Sponsors` collection. Should the id be invalid the
 * `INVALID_OBJECT_ID` error will be thrown. In case there is no object
 * associated with given id the `SPONSOR_NOT_FOUND` error gets thrown.
 *
 * The controller also uses the `MongooseExceptionFilter` in order to catch
 * unexpected errors and generate the standardized error response.
 *
 * Some handler methods inside the controller are secured with the JWT
 * authentication mechanism. In order to access these routes the specific request
 * must contain a valid and not expired access token.
 */
@Controller('sponsors')
@UseFilters(MongoDbExceptionFilter)
export class SponsorsController {
  constructor(private readonly sponsorService: SponsorsService) {}

  /**
   * Retrieves all `Sponsors` from the database and returns them.
   *
   * To prevent possible occurring errors on the client side the
   * `{ObjectNotFoundInterceptor}` is used for validating whether there are
   * `Sponsors` definied in the database or not. In case no `Sponsors` cloud be
   * found the `SPONSORS_NOT_FOUND` error will be sent back.
   *
   * @throws The ApiException with the error type `SPONSORS_NOT_FOUND` if no
   * `Sponsors` could be retrieved from the database.
   */
  @Get()
  @UseInterceptors(SponsorsNotFoundInterceptor)
  getSponsors() {
    return this.sponsorService.findAll();
  }

  /**
   * Returns the `Sponsor` which is associated with the given id.
   *
   * To prevent possible errors with a invalid id, the `ValidateIdInterceptor`
   * is used, which validates the given id from the URL. If the id does not
   * correspond to a valid `ObjectId`, a response with the `INVALID_OBJECT_ID`
   * error is sent back to the client. If the id is valid, the request will be
   * processed further.
   *
   * In addition to the `ValidateIdInterceptor`, the `{ObjectNotFoundInterceptor}`
   * is used to check whether a `Sponsor` with the specified id exists. If this
   * is not the case, the `SPONSOR_NOT_FOUND` error will be send back.
   *
   * @param id The id of the `Sponsor`.
   *
   * @throws The ApiException with the error type `INVALID_OBJECT_ID` if the URL
   * doesnt contain a valid `ObjectId`.
   *
   * @throws The ApiException with the error type `SPONSOR_NOT_FOUND` if no
   * `Sponsor` is associated with the given id.
   */
  @Get(':id')
  @UseInterceptors(ValidateSponsorIdInterceptor, SponsorNotFoundInterceptor)
  getSponsor(@Param('id') id: string) {
    return this.sponsorService.findOne(id);
  }

  /**
   * Creates a new `Sponsor` based on the given parameters inside the body.
   * These parameters will be evaluated based on the decorators within the
   * `CreateSponsorDto` class.
   *
   * If the there is already a `Sponsor` with a identical abbreviation the
   * `DUPLICATE_SPONSOR` error will be thrown.
   *
   * This route is secured with the JWT authentication mechanism. In order to
   * access this route the request must contain a valid and not expired
   * access token.
   *
   * @param createSponsorDto The class which contains the validated variables
   * for Tecreating the new `Sponsor`.
   *
   * @throws The ApiException with the error type `DUPLICATE_SPONSOR` if there
   * already exists a `Sponsor` with the given name.
   */
  @Post()
  @UseGuards(JwtAuthGuard)
  createSponsor(
    @Body('sponsor', ValidationPipe) createSponsorDto: CreateSponsorDto,
  ) {
    return this.sponsorService.createOne(createSponsorDto);
  }

  /**
   * Retrieves a `Sponsor` based on the given id and updates it with the
   * parameters inside the body. These parameters will be evaluated based on the
   * decorators within the `UpdateSponsorDto` class.
   *
   * If the there is already a `Sponsor` with a identical abbreviation the
   * `DUPLICATE_SPONSOR` error will be thrown.
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
   * is used to check whether a `Sponsor` with the specified id exists. If this
   * is not the case, the `SPONSOR_NOT_FOUND` error will be send back.
   *
   * @param id The id of the `Sponsor`.
   *
   * @param updateSponsorDto The class which contains the validated variables for
   * updating the existing `Sponsor`.
   *
   * @throws The ApiException with the error type `INVALID_OBJECT_ID` if the URL
   * doesnt contain a valid `ObjectId`.
   *
   * @throws The ApiException with the error type `SPONSOR_NOT_FOUND` if no
   * `Sponsor` is associated with the given id.
   *
   * @throws The ApiException with the error type `DUPLICATE_SPONSOR` if there
   * already exists a `Sponsor` with the given name.
   */
  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(ValidateSponsorIdInterceptor, SponsorNotFoundInterceptor)
  updateSponsor(
    @Body('changes', ValidationPipe) updateSponsorDto: UpdateSponsorDto,
    @Param('id') id: string,
  ) {
    return this.sponsorService.updateOne(id, updateSponsorDto);
  }

  /**
   * Updates a list of `Sponsors` based on the given ids and updates them with
   * the different update parameters inside the body. Each update will be
   * evaluated based on the decorators within the `UpdateSponsorsDto` class.
   *
   * @param updateSponsorsDtos The class which contains the validated sub classes
   * for updating the existing `Sponsors`.
   */
  @Put()
  @UseGuards(JwtAuthGuard)
  updateSponsors(
    @Body('updates', ValidationPipe) updateSponsorsDtos: UpdateSponsorsDto,
  ) {
    return this.sponsorService.updateMany(updateSponsorsDtos);
  }

  /**
   * Retrieves a `Sponsor` based on the given id and uploads the given image
   * within the request body. The image gets proccess by the custom
   * `Muler Storage` and will be resized in two different sizes in order to
   * provide a better loading speed when used on the website.
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
   * is used to check whether a `Sponsor` with the specified id exists. If this is
   * not the case, the `SPONSOR_NOT_FOUND` error will be send back.
   *
   * @param id The id of the `Sponsor`.
   *
   * @throws The ApiException with the error type `INVALID_OBJECT_ID` if the URL
   * doesnt contain a valid `ObjectId`.
   *
   * @throws The ApiException with the error type `SPONSOR_NOT_FOUND` if no
   * `Sponsor` is associated with the given id.
   */
  @Post(':id/image')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    ValidateSponsorIdInterceptor,
    SponsorNotFoundInterceptor,
    FileInterceptor('image', sponsorsMulterOptions),
  )
  @Header('content-type', 'multipart/form-data')
  async uploadSponsorImage(
    @Param('id') id: string,
    @MulterResults() multer: MulterStorageResponse,
  ) {
    const updateSponsorDto: UpdateSponsorDto = {
      img: {
        path: multer.results[0].path,
        updatedAt: new Date().toISOString(),
        disabled: false,
      },
    };

    await this.sponsorService.updateOne(id, updateSponsorDto);

    return {
      id,
      changes: updateSponsorDto,
    };
  }

  /**
   * Retrieves a `Sponsor` based on the given id and deletes all assoicated images.
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
   * is used to check whether a `Sponsor` with the specified id exists. If this
   * is not the case, the `SPONSOR_NOT_FOUND` error will be send back.
   *
   * @param id The id of the `Sponsor`.
   *
   * @throws The ApiException with the error type `INVALID_OBJECT_ID` if the URL
   * doesnt contain a valid `ObjectId`.
   *
   * @throws The ApiException with the error type `SPONSOR_NOT_FOUND` if no
   * `Sponsor` is associated with the given id.
   */
  @Delete(':id/image')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(ValidateSponsorIdInterceptor, SponsorNotFoundInterceptor)
  deleteSponsorImage(@Param('id') id: string) {
    return this.sponsorService.deleteSponsorImage(id);
  }

  /**
   * Deletes a `Sponsor` based on the given id. If the `Sponsor` has a picture
   * which is also stored in the database, an attempt will be made to delete it.
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
   * is used to check whether a `Sponsor` with the specified id exists. If this
   * is not the case, the `SPONSOR_NOT_FOUND` error will be send back.
   *
   * @param id The id of the `Sponsor`.
   *
   * @throws The ApiException with the error type `INVALID_OBJECT_ID` if the URL
   * doesnt contain a valid `ObjectId`.
   *
   * @throws The ApiException with the error type `SPONSOR_NOT_FOUND` if no
   * `Sponsor` is associated with the given id.
   */
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(ValidateSponsorIdInterceptor, SponsorNotFoundInterceptor)
  deleteSponsor(@Param('id') id: string) {
    return this.sponsorService.deleteOne(id);
  }
}
