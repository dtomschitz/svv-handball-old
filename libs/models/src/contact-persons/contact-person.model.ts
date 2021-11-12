import { ContactPersonCategory } from './contact-person-category.model';

export interface ContactPerson {
  _id: string;
  name: string;
  email: string;
  categoryId: string;
  category?: ContactPersonCategory;
  people?: string[];
  position: number;
  disabled?: boolean;
}
