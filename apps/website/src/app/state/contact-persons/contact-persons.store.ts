import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { GroupedContactPerson } from '@svv/core/models';

export interface ContactPersonsState
  extends EntityState<GroupedContactPerson, string> {}

@Injectable({
  providedIn: 'root',
})
@StoreConfig({ name: 'contact-persons', idKey: '_id' })
export class ContactPersonsStore extends EntityStore<ContactPersonsState> {
  constructor() {
    super({
      loading: true,
    });
  }
}
