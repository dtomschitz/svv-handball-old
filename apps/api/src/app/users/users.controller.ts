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
import { JwtAuthGuard } from '@svv/api/auth/guards';
import { ErrorType, UserRole } from '@svv/core/models';
import {
  MongooseExceptionFilter,
  ObjectNotFoundInterceptor,
  ValidateIdInterceptor,
} from '@svv/api/core/error';
import { USER_MODEL } from '@svv/api/core/constants';
import { UsersService } from '@svv/api/users/services';
import { CreateUserDto, UpdateUserDto } from './dtos';

/**
 * Default interceptor for validating whether the specified id within the URL
 * is a valid `ObjectId` or not.
 */
const ValidateUserIdInterceptor = ValidateIdInterceptor();

/**
 * Default interceptor for validating whether the created response is empty
 * or has content.
 */
const UsersNotFoundInterceptor = ObjectNotFoundInterceptor(
  ErrorType.USERS_NOT_FOUND,
);

/**
 * Default interceptor for validating whether there is a `User` stored in the
 * database which is associated with the given id of the URL or not.
 */
const UserNotFoundInterceptor = ObjectNotFoundInterceptor(
  ErrorType.USER_NOT_FOUND,
  {
    modelToken: USER_MODEL,
  },
);

/**
 * Default filter for catching unexpected errors from the database and creating
 * standardized error responses accordingly.
 */
const MongoDbExceptionFilter = new MongooseExceptionFilter({
  duplicate: ErrorType.DUPLICATE_USER,
});

/**
 * This class implements the controller functionality for the `Users` feature
 * including all necessary endpoints which are accessd by the CMS application
 * and the website.
 *
 * All requests are checked for further validation before they get processed by
 * the respective method. The @param id gets validated and checked for
 * its existence in the `Users` collection. Should the id be invalid the
 * `INVALID_OBJECT_ID` error will be thrown. In case there is no object
 * associated with given id the `USER_NOT_FOUND` error gets thrown.
 *
 * The controller also uses the `MongooseExceptionFilter` in order to catch
 * unexpected errors and generate the standardized error response.
 *
 * All handler methods inside the controller are secured with the JWT
 * authentication mechanism. In order to access these routes the specific request
 * must contain a valid and not expired access token.
 */
@Controller('users')
@UseGuards(JwtAuthGuard)
@UseFilters(MongoDbExceptionFilter)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * Retrieves all `Users` from the database and returns them.
   *
   * To prevent possible occurring errors on the client side the
   * `{ObjectNotFoundInterceptor}` is used for validating whether there are
   * `Users` definied in the database or not. In case no `Users` cloud be found
   * the `USERS_NOT_FOUND` error will be sent back.
   *
   * @throws The ApiException with the error type `USERS_NOT_FOUND` if no `Users`
   * could be retrieved from the database.
   */
  @Get()
  @UseInterceptors(UsersNotFoundInterceptor)
  getUsers() {
    return this.usersService.findAll();
  }


  /**
   * Returns the `User` which is associated with the given.
   *
   * To prevent possible errors with a invalid id, the `ValidateIdInterceptor`
   * is used, which validates the given id from the URL. If the id does not
   * correspond to a valid `ObjectId`, a response with the `INVALID_OBJECT_ID`
   * error is sent back to the client. If the id is valid, the request will be
   * processed further.
   *
   * In addition to the `ValidateIdInterceptor`, the `{ObjectNotFoundInterceptor}`
   * is used to check whether a `User` with the specified id exists. If this is
   * not the case, the `USER_NOT_FOUND` error will be send back.
   *
   * @param id The id of the `User`.
   *
   * @throws The ApiException with the error type `INVALID_OBJECT_ID` if the URL
   * doesnt contain a valid `ObjectId`.
   *
   * @throws The ApiException with the error type `USER_NOT_FOUND` if no `User`
   * is associated with the given id.
   */
  @Get(':id')
  @UseInterceptors(ValidateUserIdInterceptor, UserNotFoundInterceptor)
  getUser(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  /**
   * Creates a new `User` based on the given parameters inside the body. These
   * parameters will be evaluated based on the decorators within
   * the `CreateUserDto` class.
   *
   * If the there is already a `User` with a identical name the `DUPLICATE_USER`
   * error will be thrown.
   *
   * This route is secured with the JWT authentication mechanism. In order to
   * access this route the request must contain a valid and not expired
   * access token.
   *
   * @param createUserDto The class which contains the validated variables for
   * creating the new `User`.
   *
   * @throws The ApiException with the error type `DUPLICATE_USER` if there
   * already exists a `User` with the given name.
   */
  @Post()
  createUser(@Body('user', ValidationPipe) createUserDto: CreateUserDto) {
    return this.usersService.createOne(createUserDto);
  }

  /**
   * Retrieves a `User` based on the given id and updates it with the parameters
   * inside the body. These parameters will be evaluated based on the decorators
   * within the `UpdateUserDto` class.
   *
   * If the there is already a `User` with a identical name the `DUPLICATE_USER`
   * error will be thrown.
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
   * is used to check whether a `User` with the specified id exists. If this is
   * not the case, the `USER_NOT_FOUND` error will be send back.
   *
   * @param id The id of the `User`.
   *
   * @param updateUserDto The class which contains the validated variables for
   * updating the existing `User`.
   *
   * @throws The ApiException with the error type `INVALID_OBJECT_ID` if the URL
   * doesnt contain a valid `ObjectId`.
   *
   * @throws The ApiException with the error type `USER_NOT_FOUND` if no `User`
   * is associated with the given id.
   *
   * @throws The ApiException with the error type `DUPLICATE_USER` if there
   * already exists a `User` with the given name.
   */
  @Put(':id')
  @UseInterceptors(ValidateUserIdInterceptor, UserNotFoundInterceptor)
  updateUser(
    @Param('id') id: string,
    @Body('changes', ValidationPipe) updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.updateOne(id, updateUserDto);
  }

  /**
   * Deletes a `User` based on the given id.
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
   * is used to check whether a `User` with the specified id exists. If this is
   * not the case, the `USER_NOT_FOUND` error will be send back.
   *
   * @param id The id of the `User`.
   *
   * @throws The ApiException with the error type `INVALID_OBJECT_ID` if the URL
   * doesnt contain a valid `ObjectId`.
   *
   * @throws The ApiException with the error type `USER_NOT_FOUND` if no `User`
   * is associated with the given id.
   */
  @Delete(':id')
  @UseInterceptors(ValidateUserIdInterceptor, UserNotFoundInterceptor)
  deleteUser(@Param('id') id: string) {
    return this.usersService.deleteOne(id);
  }
}
