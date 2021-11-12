import { UpdateContactPersonDto } from './update-contact-person.dto';

export type UpdateContactPersonsDto = {
  id: string;
  changes: UpdateContactPersonDto;
}[];
