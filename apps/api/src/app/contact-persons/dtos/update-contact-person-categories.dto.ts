import { UpdateContactPersonCategoryDto } from './update-contact-person-category.dto';

export type UpdateContactPersonCategoriesDto = {
  id: string;
  changes: UpdateContactPersonCategoryDto;
}[];
