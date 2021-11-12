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
import { FileInterceptor } from '@nestjs/platform-express';
import { ErrorType, MulterStorageResponse } from '@svv/core/models';
import {
  MongooseExceptionFilter,
  ObjectNotFoundInterceptor,
  ValidateIdInterceptor,
} from '@svv/api/core/error';
import { IMAGE_MODEL } from '@svv/api/core/constants';
import { JwtAuthGuard } from '@svv/api/auth/guards';
import { CreateImageDto, UpdateImageDto } from './dtos';
import { ImagesService } from './services';
import { multerOptions } from './multer-options';
import { MulterResults } from '../core/multer';

/**
 * Default interceptor for validating whether the specified id within the URL
 * is a valid `ObjectId` or not.
 */
const ValidateImageIdInterceptor = ValidateIdInterceptor();

/**
 * Default interceptor for validating whether the created response is empty
 * or has content.
 */
const ImagesNotFoundInterceptor = ObjectNotFoundInterceptor(
  ErrorType.IMAGES_NOT_FOUND,
);

/**
 * Default filter for catching unexpected errors from the database and creating
 * standardized error responses accordingly.
 */
const ImageNotFoundInterceptor = ObjectNotFoundInterceptor(
  ErrorType.IMAGE_NOT_FOUND,
  {
    modelToken: IMAGE_MODEL,
  },
);

/**
 * Default filter for catching unexpected errors from the database and creating
 * standardized error responses accordingly.
 */
const MongoDbExceptionFilter = new MongooseExceptionFilter({
  duplicate: ErrorType.DUPLICATE_IMAGE,
});

/**
 * This class implements the controller functionality for the `Images` feature
 * including all necessary endpoints which are access by the CMS application
 * and the website.
 *
 * All requests are checked for further validation before they get processed by
 * the respective method. The @param id gets validated and checked for
 * its existence in the `Sponsors` collection. Should the id be invalid the
 * `INVALID_OBJECT_ID` error will be thrown. In case there is no object
 * associated with given id the `IMAGE_NOT_FOUND` error gets thrown.
 *
 * The controller also uses the `MongooseExceptionFilter` in order to catch
 * unexpected errors and generate the standardized error response.
 *
 * Some handler methods inside the controller are secured with the JWT
 * authentication mechanism. In order to access these routes the specific request
 * must contain a valid and not expired access token.
 */
@Controller('images')
@UseFilters(MongoDbExceptionFilter)
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}

  /**
   * Retrieves all `Images` from the database and returns them.
   *
   * To prevent possible occurring errors on the client side the
   * `ObjectNotFoundInterceptor` is used for validating whether there are
   * `Images` definied in the database or not. In case no `Images` cloud be
   * found the `IMAGES_NOT_FOUND` error will be sent back.
   *
   * @throws The ApiException with the error type `IMAGES_NOT_FOUND` if no
   * `Images` could be retrieved from the database.
   */
  @Get()
  @UseInterceptors(ImagesNotFoundInterceptor)
  getImages() {
    return this.imagesService.findAll();
  }

  /**
   * Returns the `Image` which is associated with the given id.
   *
   * To prevent possible errors with a invalid id, the `ValidateIdInterceptor`
   * is used, which validates the given id from the URL. If the id does not
   * correspond to a valid `ObjectId`, a response with the `INVALID_OBJECT_ID`
   * error is sent back to the client. If the id is valid, the request will be
   * processed further.
   *
   * In addition to the `ValidateIdInterceptor`, the `ObjectNotFoundInterceptor`
   * is used to check whether a `Image` with the specified id exists. If this
   * is not the case, the `IMAGE_NOT_FOUND` error will be send back.
   *
   * @param id The id of the `Image`.
   *
   * @throws The ApiException with the error type `INVALID_OBJECT_ID` if the URL
   * doesnt contain a valid `ObjectId`.
   *
   * @throws The ApiException with the error type `IMAGE_NOT_FOUND` if no
   * `Image` is associated with the given id.
   */
  @Get(':id')
  @UseInterceptors(ValidateImageIdInterceptor, ImageNotFoundInterceptor)
  getImage(@Param('id') id: string) {
    return this.imagesService.findOne(id);
  }

  /**
   * Creates a new `Image` based on the given parameters inside the body.
   * These parameters will be evaluated based on the decorators within the
   * `CreateImageDto` class.
   *
   * If the there is already a `Image` with a identical abbreviation the
   * `DUPLICATE_IMAGE` error will be thrown.
   *
   * This route is secured with the JWT authentication mechanism. In order to
   * access this route the request must contain a valid and not expired
   * access token.
   *
   * @param createImageDto The class which contains the validated variables
   * for creating the new `Image`.
   *
   * @throws The ApiException with the error type `DUPLICATE_IMAGE` if there
   * already exists a `Image` with the given name.
   */
  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file', multerOptions))
  createImage(
    @Body('image', ValidationPipe) createImageDto: CreateImageDto,
    @MulterResults() multer: MulterStorageResponse,
  ) {
    return this.imagesService.createOne(createImageDto);
  }

  /**
   * Retrieves a `Image` based on the given id and updates it with the
   * parameters inside the body. These parameters will be evaluated based on the
   * decorators within the `UpdateImageDto` class.
   *
   * If the there is already a `Image` with a identical abbreviation the
   * `DUPLICATE_IMAGE` error will be thrown.
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
   * is used to check whether a `Image` with the specified id exists. If this
   * is not the case, the `IMAGE_NOT_FOUND` error will be send back.
   *
   * @param id The id of the `Image`.
   *
   * @param updateImageDto The class which contains the validated variables for
   * updating the existing `Image`.
   *
   * @throws The ApiException with the error type `INVALID_OBJECT_ID` if the URL
   * doesnt contain a valid `ObjectId`.
   *
   * @throws The ApiException with the error type `IMAGE_NOT_FOUND` if no
   * `Image` is associated with the given id.
   *
   * @throws The ApiException with the error type `DUPLICATE_IMAGE` if there
   * already exists a `Image` with the given name.
   */
  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(ValidateImageIdInterceptor, ImageNotFoundInterceptor)
  updateImage(
    @Body('changes', ValidationPipe) updateImageDto: UpdateImageDto,
    @Param('id') id: string,
  ) {
    return this.imagesService.updateOne(id, updateImageDto);
  }

  /**
   * Deletes a `Image` based on the given id. If the `Image` has a picture
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
   * is used to check whether a `Image` with the specified id exists. If this
   * is not the case, the `IMAGE_NOT_FOUND` error will be send back.
   *
   * @param id The id of the `Image`.
   *
   * @throws The ApiException with the error type `INVALID_OBJECT_ID` if the URL
   * doesnt contain a valid `ObjectId`.
   *
   * @throws The ApiException with the error type `IMAGE_NOT_FOUND` if no
   * `Image` is associated with the given id.
   */
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(ValidateImageIdInterceptor, ImageNotFoundInterceptor)
  deleteImage(@Param('id') id: string) {
    return this.imagesService.deleteOne(id);
  }
}
