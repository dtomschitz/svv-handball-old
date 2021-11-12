import {
  Body,
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
import { ErrorType } from '@svv/core/models';
import {
  MongooseExceptionFilter,
  ObjectNotFoundInterceptor,
  ValidateIdInterceptor,
} from '@svv/api/core/error';
import { IMAGE_TAG_MODEL } from '@svv/api/core/constants';
import { JwtAuthGuard } from '@svv/api/auth/guards';
import { CreateImageTagDto, UpdateImageTagDto } from './dtos';
import { ImageTagsService } from './services';

/**
 * Default interceptor for validating whether the specified id within the URL
 * is a valid `ObjectId` or not.
 */
const ValidateImageTagIdInterceptor = ValidateIdInterceptor();

/**
 * Default interceptor for validating whether the created response is empty
 * or has content.
 */
const ImageTagssNotFoundInterceptor = ObjectNotFoundInterceptor(
  ErrorType.IMAGE_TAGS_NOT_FOUND,
);

/**
 * Default filter for catching unexpected errors from the database and creating
 * standardized error responses accordingly.
 */
const ImageTagNotFoundInterceptor = ObjectNotFoundInterceptor(
  ErrorType.IMAGE_TAG_NOT_FOUND,
  {
    modelToken: IMAGE_TAG_MODEL,
  },
);

/**
 * Default filter for catching unexpected errors from the database and creating
 * standardized error responses accordingly.
 */
const MongoDbExceptionFilter = new MongooseExceptionFilter({
  duplicate: ErrorType.DUPLICATE_IMAGE_TAG,
});

/**
 * This class implements the controller functionality for the `Image Tags`
 * feature including all necessary endpoints which are access by the CMS
 * application and the website.
 *
 * All requests are checked for further validation before they get processed by
 * the respective method. The @param id gets validated and checked for
 * its existence in the `Image Tags` collection. Should the id be invalid the
 * `INVALID_OBJECT_ID` error will be thrown. In case there is no object
 * associated with given id the `IMAGE_TAG_NOT_FOUND` error gets thrown.
 *
 * The controller also uses the `MongooseExceptionFilter` in order to catch
 * unexpected errors and generate the standardized error response.
 *
 * Some handler methods inside the controller are secured with the JWT
 * authentication mechanism. In order to access these routes the specific request
 * must contain a valid and not expired access token.
 */
@Controller('images/tags')
@UseFilters(MongoDbExceptionFilter)
export class ImageTagsController {
  constructor(private readonly imageTagsService: ImageTagsService) {}

  /**
   * Retrieves all `Image Tags` from the database and returns them.
   *
   * To prevent possible occurring errors on the client side the
   * `ObjectNotFoundInterceptor` is used for validating whether there are
   * `Image Tags` definied in the database or not. In case no `Image Tags` cloud
   * be found the `IMAGE_TAGS_NOT_FOUND` error will be sent back.
   *
   * @throws The ApiException with the error type `IMAGE_TAGS_NOT_FOUND if
   * no `Image Tags` could be retrieved from the database.
   */
  @Get()
  @UseInterceptors(ImageTagssNotFoundInterceptor)
  getImageTags() {
    return this.imageTagsService.findAll();
  }

  /**
   * Creates a new `Image Tag` based on the given parameters inside the body.
   * These parameters will be evaluated based on the decorators within the
   * `CreateImageTagDto` class.
   *
   * If the there is already a `Image Tag` with a identical abbreviation the
   * `DUPLICATE_IMAGE_TAG` error will be thrown.
   *
   * This route is secured with the JWT authentication mechanism. In order to
   * access this route the request must contain a valid and not expired
   * access token.
   *
   * @param createSponsorDto The class which contains the validated variables
   * for Tecreating the new `Image Tag`.
   *
   * @throws The ApiException with the error type `DUPLICATE_IMAGE_TAG` if there
   * already exists a `Image Tag` with the given name.
   */
  @Post()
  @UseGuards(JwtAuthGuard)
  createImageTag(
    @Body('tag', ValidationPipe) createImageTagDto: CreateImageTagDto,
  ) {
    return this.imageTagsService.createOne(createImageTagDto);
  }

  /**
   * Retrieves a `Image Tag` based on the given id and updates it with the
   * parameters inside the body. These parameters will be evaluated based on the
   * decorators within the `UpdateImageTagDto` class.
   *
   * If the there is already a `Image Tag` with a identical abbreviation the
   * `DUPLICATE_IMAGE_TAG` error will be thrown.
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
   * In addition to the `ValidateIdInterceptor`, the `ObjectNotFoundInterceptor`
   * is used to check whether a `Image Tag` with the specified id exists. If this
   * is not the case, the `IMAGE_TAG_NOT_FOUND` error will be send back.
   *
   * @param id The id of the `Image Tag`.
   *
   * @param updateImageTagDto The class which contains the validated variables for
   * updating the existing `Image Tag`.
   *
   * @throws The ApiException with the error type `INVALID_OBJECT_ID` if the URL
   * doesnt contain a valid `ObjectId`.
   *
   * @throws The ApiException with the error type `IMAGE_TAG_NOT_FOUND` if no
   * `Image Tag` is associated with the given id.
   *
   * @throws The ApiException with the error type `DUPLICATE_IMAGE_TAG` if there
   * already exists a `Image Tag` with the given name.
   */
  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(ValidateImageTagIdInterceptor, ImageTagNotFoundInterceptor)
  updateImageTag(
    @Body('changes', ValidationPipe) updateImageTagDto: UpdateImageTagDto,
    @Param('id') id: string,
  ) {
    return this.imageTagsService.updateOne(id, updateImageTagDto);
  }

  /**
   * Deletes a `Image Tag` based on the given id. If the `Image Tag` has a
   * picture which is also stored in the database, an attempt will be made
   * to delete it.
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
   * In addition to the `ValidateIdInterceptor`, the `ObjectNotFoundInterceptor`
   * is used to check whether a `Image Tag` with the specified id exists. If this
   * is not the case, the `IMAGE_NOT_FOUND` error will be send back.
   *
   * @param id The id of the `Image Tag`.
   *
   * @throws The ApiException with the error type `INVALID_OBJECT_ID` if the URL
   * doesnt contain a valid `ObjectId`.
   *
   * @throws The ApiException with the error type `IMAGE_NOT_FOUND` if no
   * `Image Tag` is associated with the given id.
   */
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(ValidateImageTagIdInterceptor, ImageTagNotFoundInterceptor)
  deleteImageTag(@Param('id') id: string) {
    return this.imageTagsService.deleteOne(id);
  }
}
