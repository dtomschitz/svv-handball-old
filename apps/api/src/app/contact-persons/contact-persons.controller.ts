import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseFilters,
  UseGuards,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { ErrorType } from '@svv/core/models';
import { JwtAuthGuard } from '@svv/api/auth/guards';
import {
  MongooseExceptionFilter,
  ObjectNotFoundInterceptor,
  ValidateIdInterceptor,
} from '@svv/api/core/error';
import { CONTACT_PERSON_MODEL } from '@svv/api/core/constants';
import { ContactPersonsService } from './services';
import {
  CreateContactPersonDto,
  ListAllCategories,
  UpdateContactPersonDto,
  UpdateContactPersonsDto,
} from './dtos';

/**
 * Default interceptor for validating whether the specified id within the URL
 * is a valid `ObjectId` or not.
 */
const ValidateContactPersonIdInterceptor = ValidateIdInterceptor();

/**
 * Default interceptor for validating whether the created response is empty
 * or has content.
 */
const ContactPersonsNotFoundInterceptor = ObjectNotFoundInterceptor(
  ErrorType.CONTACT_PERSONS_NOT_FOUND,
);

/**
 * Default interceptor for validating whether there is a `Contact Person` stored
 * in the database which is associated with the given id of the URL or not.
 */
const ContactPersonNotFoundInterceptor = ObjectNotFoundInterceptor(
  ErrorType.CONTACT_PERSON_NOT_FOUND,
  {
    modelToken: CONTACT_PERSON_MODEL,
  },
);

/**
 * Default filter for catching unexpected errors from the database and creating
 * standardized error responses accordingly.
 */
const MongoDbExceptionFilter = new MongooseExceptionFilter({
  duplicate: ErrorType.DUPLICATE_CONTACT_PERSON,
});

/**
 * This class implements the controller functionality for the `Contact Person`
 * feature including all necessary endpoints which are accessd by the CMS
 * application and the website.
 *
 * All requests are checked for further validation before they get processed by
 * the respective method. The @param id gets validated and checked for
 * its existence in the `Users` collection. Should the id be invalid the
 * `INVALID_OBJECT_ID` error will be thrown. In case there is no object
 * associated with given id the `CONTACT_PERSON_NOT_FOUND` error gets thrown.
 *
 * The controller also uses the `MongooseExceptionFilter` in order to catch
 * unexpected errors and generate the standardized error response.
 *
 * Some handler methods inside the controller are secured with the JWT
 * authentication mechanism. In order to access these routes the specific
 * request  must contain a valid and not expired access token.
 */
@Controller('contact-persons')
@UseFilters(MongoDbExceptionFilter)
export class ContactPersonsController {
  constructor(private readonly contactPersonsService: ContactPersonsService) {}

  /**
   * Retrieves all `Contact Persons` from the database and returns them.
   *
   * To prevent possible occurring errors on the client side the
   * `ObjectNotFoundInterceptor` is used for validating whether there are
   * `Contact Person` definied in the database or not. In case no
   * `Contact Person` cloud be found the `CONTACT_PERSONS_NOT_FOUND` error will
   * be sent back.
   *
   * @throws The ApiException with the error type `CONTACT_PERSONS_NOT_FOUND` if
   * no `Contact Persons` could be retrieved from the database.
   */
  @Get()
  @UseInterceptors(ContactPersonsNotFoundInterceptor)
  getContactPersons(@Query() query: ListAllCategories) {
    return this.contactPersonsService.findAll(query);
  }

  /**
   * Creates a new `Contact Person` based on the given parameters inside the
   * body. These parameters will be evaluated based on the decorators within
   * the `CreateContactPersonDto` class.
   *
   * If the there is already a `Contact Person` with a identical abbreviation
   * the `DUPLICATE_CONTACT_PERSON` error will be thrown.
   *
   * This route is secured with the JWT authentication mechanism. In order to
   * access this route the request must contain a valid and not expired
   * access token.
   *
   * @param createContactPersonDto The class which contains the validated
   * variables for creating the new `Contact Persons`.
   *
   * @throws The ApiException with the error type `DUPLICATE_CONTACT_PERSON` if
   * there already exists a `Contact Person` with the given name.
   */
  @Post()
  @UseGuards(JwtAuthGuard)
  createContactPerson(
    @Body('contactPerson', ValidationPipe)
    createContactPersonDto: CreateContactPersonDto,
  ) {
    return this.contactPersonsService.createOne(createContactPersonDto);
  }

  /**
   * Retrieves a `Contact Person` based on the given id and updates it with the parameters
   * inside the body. These parameters will be evaluated based on the decorators
   * within the `UpdateContactPersonDto` class.
   *
   * This route is secured with the JWT authentication mechanism. In order to
   * access this route the request must contain a valid and not expired
   * access token.
   *
   * If the there is already a `Contact Person` with a identical abbreviation the
   * `DUPLICATE_CONTACT_PERSON` error will be thrown.
   *
   * To prevent possible errors with a invalid id, the `ValidateIdInterceptor`
   * is used, which validates the given id from the URL. If the id does not
   * correspond to a valid `ObjectId`, a response with the `INVALID_OBJECT_ID`
   * error is sent back to the client. If the id is valid, the request will be
   * processed further.
   *
   * In addition to the `ValidateIdInterceptor`, the `{ObjectNotFoundInterceptor}`
   * is used to check whether a `Contact Person` with the specified id exists. If
   * this is not the case, the `CONTACT_PERSON_NOT_FOUND` error will be send back.
   *
   * @param id The id of the `Contact Person`.
   *
   * @param updateContactPersonDto The class which contains the validated
   * variables for updating the existing `Contact Person`.
   *
   * @throws The ApiException with the error type `INVALID_OBJECT_ID` if the URL
   * doesnt contain a valid `ObjectId`.
   *
   * @throws The ApiException with the error type `CONTACT_PERSON_NOT_FOUND` if
   * no `Contact Person` is associated with the given id.
   *
   * @throws The ApiException with the error type `DUPLICATE_CONTACT_PERSON` if
   * there already exists a `Contact Person` with the given name.
   */
  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    ValidateContactPersonIdInterceptor,
    ContactPersonNotFoundInterceptor,
  )
  updateContactPerson(
    @Body('changes', ValidationPipe)
    updateContactPersonDto: UpdateContactPersonDto,
    @Param('id') id: string,
  ) {
    return this.contactPersonsService.updateOne(id, updateContactPersonDto);
  }

  /**
   * Updates a list of `Contact Persons` based on the given ids and updates them
   * with the different update parameters inside the body. Each update will be
   * evaluated based on the decorators within the `UpdateContactPersonsDto` class.
   *
   * @param updateContactPersonsDto The class which contains the validated sub
   * classes for updating the existing `Contact Person`.
   */
  @Put()
  @UseGuards(JwtAuthGuard)
  updateContactPersons(
    @Body('updates', ValidationPipe)
    updateContactPersonsDto: UpdateContactPersonsDto,
  ) {
    return this.contactPersonsService.updateMany(updateContactPersonsDto);
  }

  /**
   * Deletes a `Contact Person` based on the given id. If the `Contact Person`
   * has a picture which is also stored in the database, an attempt will be made
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
   * is used to check whether a `Contact Person` with the specified id exists.
   * If this is not the case, the `CONTACT_PERSON_NOT_FOUND` error
   * will be send back.
   *
   * @param id The id of the `Contact Person`.
   *
   * @throws The ApiException with the error type `INVALID_OBJECT_ID` if the URL
   * doesnt contain a valid `ObjectId`.
   *
   * @throws The ApiException with the error type `CONTACT_PERSON_NOT_FOUND` if
   * no `Contact Person` is associated with the given id.
   */
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    ValidateContactPersonIdInterceptor,
    ContactPersonNotFoundInterceptor,
  )
  deleteContactPerson(@Param('id') id: string) {
    return this.contactPersonsService.deleteOne(id);
  }
}
