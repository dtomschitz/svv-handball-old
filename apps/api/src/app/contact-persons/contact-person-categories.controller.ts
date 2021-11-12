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
import { JwtAuthGuard } from '@svv/api/auth/guards';
import {
  MongooseExceptionFilter,
  ObjectNotFoundInterceptor,
  ValidateIdInterceptor,
} from '@svv/api/core/error';
import { CONTACT_PERSON_CATEGORY_MODEL } from '@svv/api/core/constants';
import { ContactPersonCategoriesService } from './services';
import {
  CreateContactPersonCategoryDto,
  UpdateContactPersonCategoryDto,
  UpdateContactPersonCategoriesDto,
} from './dtos';

const ValidateContactPersonCategoryIdInterceptor = ValidateIdInterceptor();

const ContactPersonCategoriesNotFoundInterceptor = ObjectNotFoundInterceptor(
  ErrorType.CONTACT_PERSON_CATEGORIES_NOT_FOUND,
);

const ContactPersonCategoryNotFoundInterceptor = ObjectNotFoundInterceptor(
  ErrorType.CONTACT_PERSON_CATEGORY_NOT_FOUND,
  {
    modelToken: CONTACT_PERSON_CATEGORY_MODEL,
  },
);

const MongoDbExceptionFilter = new MongooseExceptionFilter({
  duplicate: ErrorType.DUPLICATE_CONTACT_PERSON_CATEGORY,
});

@Controller('contact-persons/categories')
@UseFilters(MongoDbExceptionFilter)
export class ContactPersonCategoriesController {
  constructor(
    private readonly contactPersonCategoriesService: ContactPersonCategoriesService,
  ) {}

  @Get()
  @UseInterceptors(ContactPersonCategoriesNotFoundInterceptor)
  getContactPersonCategories() {
    return this.contactPersonCategoriesService.findAll();
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  createContactPersonCategory(
    @Body('category', ValidationPipe)
    createContactPersonDto: CreateContactPersonCategoryDto,
  ) {
    return this.contactPersonCategoriesService.createOne(
      createContactPersonDto,
    );
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    ValidateContactPersonCategoryIdInterceptor,
    ContactPersonCategoryNotFoundInterceptor,
  )
  updateContactPersonCategory(
    @Body('changes', ValidationPipe)
    updateContactPersonCategoryDto: UpdateContactPersonCategoryDto,
    @Param('id') id: string,
  ) {
    return this.contactPersonCategoriesService.updateOne(
      id,
      updateContactPersonCategoryDto,
    );
  }

  @Put()
  @UseGuards(JwtAuthGuard)
  updateContactPersonCategories(
    @Body('updates')
    updateContactPersonCategoriesDto: UpdateContactPersonCategoriesDto,
  ) {
    return this.contactPersonCategoriesService.updateMany(
      updateContactPersonCategoriesDto,
    );
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    ValidateContactPersonCategoryIdInterceptor,
    ContactPersonCategoryNotFoundInterceptor,
  )
  deleteContactPersonCategory(@Param('id') id: string) {
    return this.contactPersonCategoriesService.deleteOne(id);
  }
}
