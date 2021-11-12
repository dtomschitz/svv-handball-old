import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import {
  ContactPersonsState,
  ContactPersonsStore,
} from './contact-persons.store';

@Injectable({
  providedIn: 'root',
})
export class ContactPersonsQuery extends QueryEntity<ContactPersonsState> {
  constructor(protected store: ContactPersonsStore) {
    super(store);
  }
}
