import { ContactPerson } from './contact-person.model';

export interface GroupedContactPerson {
  _id: string;
  name: string;
  contactPersons: ContactPerson[];
}
