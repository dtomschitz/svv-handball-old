import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
  UseInterceptors,
  ValidationPipe,
  Query,
  UseFilters,
} from '@nestjs/common';
import { ErrorType } from '@svv/core/models';
import { JwtAuthGuard } from '@svv/api/auth/guards';
import {
  MongooseExceptionFilter,
  ObjectNotFoundInterceptor,
  ValidateIdInterceptor,
} from '@svv/api/core/error';
import { ARTICLE_CATEGORY_MODEL, ARTICLE_MODEL } from '@svv/api/core/constants';
import { ListAllArticles } from './dtos';
import { ArticlesService, ArticleCategoriesService } from './services';
import {
  CreateArticleDto,
  UpdateArticleDto,
  CreateCategoryDto,
  UpdateCategoryDto,
} from './dtos';

/**
 * Default interceptor for validating whether the created response is empty
 * or has content.
 */
export const ArticlesNotFoundInterceptor = ObjectNotFoundInterceptor(
  ErrorType.ARTICLES_NOT_FOUND,
);

/**
 * Default interceptor for validating whether the created response is empty
 * or has content.
 */
export const CategoriesNotFoundInterceptor = ObjectNotFoundInterceptor(
  ErrorType.CATEGORIES_NOT_FOUND,
);

/**
 * Default interceptor for validating whether there is a `Article` stored in the
 * database which is associated with the given id of the URL or not.
 */
export const ArticleNotFoundInterceptor = ObjectNotFoundInterceptor(
  ErrorType.ARTICLE_NOT_FOUND,
  {
    modelToken: ARTICLE_MODEL,
  },
);

/**
 * Default interceptor for validating whether there is a `Article Category`
 * stored in the database which is associated with the given id of the URL or not.
 */
export const CategoryNotFoundInterceptor = ObjectNotFoundInterceptor(
  ErrorType.CATEGORY_NOT_FOUND,
  {
    modelToken: ARTICLE_CATEGORY_MODEL,
  },
);

/**
 * Default filter for catching unexpected errors from the database and creating
 * standardized error responses accordingly.
 */
const MongoDbExceptionFilter = new MongooseExceptionFilter({});

/**
 * This class implements the controller functionality for the `Articles` feature
 * including all necessary endpoints which are accessd by the CMS application
 * and the website.
 *
 * All requests are checked for further validation before they get processed by
 * the respective method. The @param id gets validated and checked for its
 * existence in the `Articles` or `Articles Category` collection. Should the
 * id be invalid the `INVALID_OBJECT_ID` error will be thrown. In case there is
 * no object associated with given id the `ARTICLE_NOT_FOUND`,
 * `ARTICLES_NOT_FOUND`, `CATEGORY_NOT_FOUND` or `CATEGORIES_NOT_FOUND` error
 * will be thrown.
 *
 * The controller also uses the `MongooseExceptionFilter` in order to catch
 * unexpected errors and generate the standardized error response.
 *
 * Some handler methods inside the controller are secured with the JWT
 * authentication mechanism. In order to access these routes the specific request
 * must contain a valid and not expired access token.
 */
@Controller('articles')
@UseFilters(MongoDbExceptionFilter)
export class ArticlesController {
  constructor(
    private readonly articlesService: ArticlesService,
    private readonly categoriesService: ArticleCategoriesService,
  ) {}

  /**
   * Retrieves all `Articles` from the database and returns them. The response
   * is also populated with the specific `Categories`, `Authors` and the
   * associated `Team` if the properties are correctly linked.
   *
   * To prevent possible occurring errors on the client side the
   * `ObjectNotFoundInterceptor` is used for validating whether there are
   * `Articles` definied in the database or not. In case no `Articles` cloud be
   * found the `ARTICLES_NOT_FOUND` error will be sent back.
   *
   * @throws The ApiException with the error type `ARTICLES_NOT_FOUND` if no
   * `Articles` could be retrieved from the database.
   */
  @Get()
  @UseInterceptors(ArticlesNotFoundInterceptor)
  getArticles(@Query() query: ListAllArticles) {
    return this.articlesService.findAll(query);
  }

  /**
   * Retrieves all `Categories` from the database and returns them.
   *
   * To prevent possible occurring errors on the client side the
   * `ObjectNotFoundInterceptor` is used for validating whether there are
   * `Categories` definied in the database or not. In case no `Categories` cloud
   * be found the `CATEGORIES_NOT_FOUND` error will be sent back.
   *
   * @throws The ApiException with the error type `CATEGORIES_NOT_FOUND` if no
   * `Articles` could be retrieved from the database.
   */
  @Get('categories')
  @UseInterceptors(CategoriesNotFoundInterceptor)
  getArticleCategories() {
    return this.categoriesService.findAll();
  }

  /**
   * Returns the `Article` which is associated with the given id and populates
   * it with the specific `Categories`, `Authors` and the associated `Team` if
   * the properties are correctly linked.
   *
   * To prevent possible errors with a invalid id, the `ValidateIdInterceptor`
   * is used, which validates the given id from the URL. If the id does not
   * correspond to a valid `ObjectId`, a response with the `INVALID_OBJECT_ID`
   * error is sent back to the client. If the id is valid, the request will be
   * processed further.
   *
   * In addition to the `ValidateIdInterceptor`, the `ObjectNotFoundInterceptor`
   * is used to check whether a `Article` with the specified id exists. If this
   * is not the case, the `ARTICLE_NOT_FOUND` error will be send back.
   *
   * @param id The id of the `Article`.
   *
   * @throws The ApiException with the error type `INVALID_OBJECT_ID` if the URL
   * doesnt contain a valid `ObjectId`.
   *
   * @throws The ApiException with the error type `ARTICLE_NOT_FOUND` if no
   * `Article` is associated with the given id.
   */
  @Get(':id')
  @UseInterceptors(ValidateIdInterceptor(), ArticleNotFoundInterceptor)
  getArticle(@Param('id') id: string) {
    return this.articlesService.findOne(id);
  }

  /**
   * Returns the `Category` which is associated with the given id.
   *
   * To prevent possible errors with a invalid id, the `ValidateIdInterceptor`
   * is used, which validates the given id from the URL. If the id does not
   * correspond to a valid `ObjectId`, a response with the `INVALID_OBJECT_ID`
   * error is sent back to the client. If the id is valid, the request will be
   * processed further.
   *
   * In addition to the `ValidateIdInterceptor`, the `ObjectNotFoundInterceptor`
   * is used to check whether a `Category` with the specified id exists. If this
   * is not the case, the `CATEGORY_NOT_FOUND` error will be send back.
   *
   * @param id The id of the `Category`.
   *
   * @throws The ApiException with the error type `INVALID_OBJECT_ID` if the URL
   * doesnt contain a valid `ObjectId`.
   *
   * @throws The ApiException with the error type `CATEGORY_NOT_FOUND` if no
   * `Category` is associated with the given id.
   */
  @Get('categories/:id')
  @UseInterceptors(ValidateIdInterceptor(), CategoryNotFoundInterceptor)
  getCategory(@Param('id') id: string) {
    return this.categoriesService.findOne(id);
  }

  /**
   * Creates a new `Article` based on the given parameters inside the body.
   * These parameters will be evaluated based on the decorators within the
   * `CreateArticleDto` class.
   *
   * This route is secured with the JWT authentication mechanism. In order to
   * access this route the request must contain a valid and not expired
   * access token.
   *
   * @param createArticleDto The class which contains the validated variables
   * for creating the new `Article`.
   */
  @Post()
  @UseGuards(JwtAuthGuard)
  createArticle(
    @Body('article', ValidationPipe) createArticleDto: CreateArticleDto,
  ) {
    return this.articlesService.createOne(createArticleDto);
  }

  /**
   * Creates a new `Category` based on the given parameters inside the body.
   * These parameters will be evaluated based on the decorators within the
   * `CreateCategoryDto` class.
   *
   * If the there is already a `Category` with a identical abbreviation the
   * `DUPLICATE_CATEGORY` error will be thrown.
   *
   * This route is secured with the JWT authentication mechanism. In order to
   * access this route the request must contain a valid and not expired
   * access token.
   *
   * @param createCategoryDto The class which contains the validated variables
   * for creating the new `Category`.
   *
   * @throws The ApiException with the error type `DUPLICATE_CATEGORY` if there
   * already exists a `Article Category` with the given name.
   */
  @Post('categories')
  @UseGuards(JwtAuthGuard)
  @UseFilters(
    new MongooseExceptionFilter({
      duplicate: ErrorType.DUPLICATE_CATEGORY,
    }),
  )
  createArticleCategory(
    @Body('category', ValidationPipe) createCategoryDto: CreateCategoryDto,
  ) {
    return this.categoriesService.createOne(createCategoryDto);
  }

  /**
   * Retrieves a `Article` based on the given id and updates it with the
   * parameters inside the body. These parameters will be evaluated based on the
   * decorators within the `UpdateArticleDto` class.
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
   * is used to check whether a `Article` with the specified id exists. If this
   * is not the case, the `ARTICLE_NOT_FOUND` error will be send back.
   *
   * @param id The id of the `Article`.
   *
   * @param updateArticleDto The class which contains the validated variables
   * for updating the existing `Article`.
   *
   * @throws The ApiException with the error type `INVALID_OBJECT_ID` if the URL
   * doesnt contain a valid `ObjectId`.
   *
   * @throws The ApiException with the error type `ARTICLE_NOT_FOUND` if no
   * `Article` is associated with the given id.
   */
  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(ValidateIdInterceptor(), ArticleNotFoundInterceptor)
  updateArticle(
    @Body('changes', ValidationPipe) updateArticleDto: UpdateArticleDto,
    @Param('id') id: string,
  ) {
    return this.articlesService.updateOne(id, updateArticleDto);
  }

  /**
   * Retrieves a `Article Category` based on the given id and updates it with
   * the parameters inside the body. These parameters will be evaluated based on
   * the decorators within the `UpdateCategoryDto` class.
   *
   * This route is secured with the JWT authentication mechanism. In order to
   * access this route the request must contain a valid and not expired
   * access token.
   *
   * If the there is already a `Article Category` with a identical abbreviation
   * the `DUPLICATE_CATEGORY` error will be thrown.
   *
   * To prevent possible errors with a invalid id, the `ValidateIdInterceptor`
   * is used, which validates the given id from the URL. If the id does not
   * correspond to a valid `ObjectId`, a response with the `INVALID_OBJECT_ID`
   * error is sent back to the client. If the id is valid, the request will be
   * processed further.
   *
   * In addition to the `ValidateIdInterceptor`, the `ObjectNotFoundInterceptor`
   * is used to check whether a `Category` with the specified id exists. If this
   * is not the case, the `CATEGORY_NOT_FOUND` error will be send back.
   *
   * @param id The id of the `Category`.
   *
   * @param updateCategoryDto The class which contains the validated variables
   * for updating the existing `Category`.
   *
   * @throws The ApiException with the error type `INVALID_OBJECT_ID` if the URL
   * doesnt contain a valid `ObjectId`.
   *
   * @throws The ApiException with the error type `CATEGORY_NOT_FOUND` if no
   * `Category`  is associated with the given id.
   *
   * @throws The ApiException with the error type `DUPLICATE_CATEGORY` if there
   * already exists a `Category` with the given name.
   */
  @Put('categories/:id')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(ValidateIdInterceptor(), CategoryNotFoundInterceptor)
  @UseFilters(
    new MongooseExceptionFilter({
      duplicate: ErrorType.DUPLICATE_CATEGORY,
    }),
  )
  updateArticleCategory(
    @Body('changes', ValidationPipe) updateCategoryDto: UpdateCategoryDto,
    @Param('id') id: string,
  ) {
    return this.categoriesService.updateOne(id, updateCategoryDto);
  }

  /**
   * Deletes a `Article` based on the given id.
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
   * is used to check whether a `Article` with the specified id exists. If this
   * is not the case, the `ARTICLE_NOT_FOUND` error will be send back.
   *
   * @param id The id of the `Article`.
   *
   * @throws The ApiException with the error type `INVALID_OBJECT_ID` if the URL
   * doesnt contain a valid `ObjectId`.
   *
   * @throws The ApiException with the error type `ARTICLE_NOT_FOUND` if no
   * `Article` is associated with the given id.
   */
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(ValidateIdInterceptor(), ArticleNotFoundInterceptor)
  deleteArticle(@Param('id') id: string) {
    return this.articlesService.deleteOne(id);
  }

  /**
   * Deletes a `Article Category` based on the given id.
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
   * is used to check whether a `Article Category` with the specified id exists.
   * If this is not the case, the `CATEGORY_NOT_FOUND` error will be send back.
   *
   * @param id The id of the `Article Category`.
   *
   * @throws The ApiException with the error type `INVALID_OBJECT_ID` if the URL
   * doesnt contain a valid `ObjectId`.
   *
   * @throws The ApiException with the error type `CATEGORY_NOT_FOUND` if no
   * `Article Category` is associated with the given id.
   */
  @Delete('categories/:id')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(ValidateIdInterceptor(), CategoryNotFoundInterceptor)
  deleteCategory(@Param('id') id: string) {
    return this.categoriesService.deleteOne(id);
  }
}
