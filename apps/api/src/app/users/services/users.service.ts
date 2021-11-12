import { Inject, Injectable } from '@nestjs/common';
import { ErrorType, UserRole } from '@svv/core/models';
import { ApiException } from '@svv/api/core/error';
import { USER_MODEL } from '@svv/api/core/constants';
import { ArticlesService } from '@svv/api/articles/services';
import { TeamsService } from '@svv/api/teams/services';
import { User } from '@svv/api/users/interfaces';
import { CreateUserDto, UpdateUserDto } from '@svv/api/users/dtos';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @Inject(USER_MODEL) private userModel: Model<User>,
    private teamsService: TeamsService,
    private articlesService: ArticlesService,
  ) {}

  /**
   * Retrieves all `Users` from the database and returns them.
   */
  findAll() {
    return this.userModel.find().exec();
  }

  /**
   * Returns the `User` which is associated with the given id.
   *
   * @param id The id of the `User`.
   */
  findOne(id: string) {
    return this.userModel.findOne({ _id: id }).exec();
  }

  /**
   * Returns the `Users` total.
   */
  findTotal() {
    return this.userModel.countDocuments().exec();
  }

  /**
   * Creates a new `User` based on the given parameters and returns it after a
   * successful creation. If the there is already a `User` with a identical name
   * the `DUPLICATE_USER` error will be thrown.
   *
   * In case the given parameters contain one named `password`, this parameter
   * will be overridden with an hashed version of it in order to store it savely
   * in the database.
   *
   * @param createUserDto The class which contains the validated variables for
   * creating the new `User`.
   *
   * @throws The ApiException with the error type `DUPLICATE_USER` if there
   * already exists a `User` with the given name.
   */
  async createOne(createUserDto: CreateUserDto) {
    if (createUserDto.email) {
      const user = await this.userModel
        .findOne({ email: createUserDto.email })
        .select('+password')
        .select('+refreshToken');

      if (user) {
        throw new ApiException(ErrorType.DUPLICATE_USER);
      }
    }

    let { password } = createUserDto;
    if (password) {
      password = await bcrypt.hash(password, 10);
    }

    const createdUser = new this.userModel({ ...createUserDto, password });
    const savedUser = await createdUser.save();
    return this.findOne(savedUser._id);
  }

  /**
   * Retrieves a `User` based on the given id, updates it with the changes and
   * returns the modified document.
   *
   * In case the given changes contain a parameter named `password`, this
   * parameter will be overridden with an hashed version of it in order to store
   * it savely in the database.
   *
   * @param id The id of the `User`.
   * @param updateUserDto The class which contains the validated variables for
   * updating the existing `User`.
   */
  async updateOne(id: string, updateUserDto: UpdateUserDto) {
    const changes = { ...updateUserDto };
    if (changes.password) {
      changes.password = await bcrypt.hash(changes.password, 10);
    }

    return this.userModel.findOneAndUpdate(
      { _id: id },
      { $set: changes },
      { new: true },
    );
  }

  /**
   * Deletes a `User` based on the given id. Additionaly it will try to remove
   * the id of the `User` from all `Teams` if the given id is present inside the
   * coachIds array.
   *
   * @param id The id of the `User`.
   */
  async deleteOne(id: string) {
    const session = await this.userModel.startSession();
    session.startTransaction();

    try {
      const user = await this.userModel.findOneAndRemove({ _id: id });
      if (user.role === UserRole.TRAINER) {
        await this.teamsService.removeCoachId(id);
      }

      if (user.role === UserRole.AUTHOR) {
        await this.articlesService.removeAuthorId(id);
      }

      await session.commitTransaction();
      session.endSession();

      return true;
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  }

  /**
   * Validates the given credentials. If no `User` associated with the given
   * email can be found inside the `users` collection, the `INVALID_EMAIL` error
   * will be thrown.
   *
   * In order to prevent deactivated `Users` from accessing protected content, a
   * check is performed to determine whether the respective `User` is activated
   * or deactivated. Should the latter be the case the error `USER_DISABLED`
   * will be thrown.
   *
   * Finally, if a `User` has been found associated with the given email and it
   * is not disabled, the password will be validated. Only if the password ist
   * correct the determined will be returned.
   *
   * @param email The email of the `User` which tries to login.
   * @param password The password of the `User` which tries to login.
   *
   * @throws The ApiException with the error type `INVALID_EMAIL` if no `User`
   * is associated with the given email.
   *
   * @throws The ApiException with the error type `USER_DISABLED` if the found
   * `User` is disabled.
   *
   * @throws The ApiException with the error type `INVALID_PASSWORD` if the
   * given password is incorrect.
   */
  async validate(email: string, password: string) {
    const user = await this.userModel
      .findOne({ email })
      .select('+password')
      .select('+refreshToken');

    if (!user) {
      throw new ApiException(ErrorType.INVALID_EMAIL);
    }

    if (!user.canLogin) {
      throw new ApiException(ErrorType.USER_DISABLED);
    }

    const valid = await bcrypt.compare(password, user.password);
    if (valid) {
      return user;
    }

    throw new ApiException(ErrorType.INVALID_PASSWORD);
  }
}
