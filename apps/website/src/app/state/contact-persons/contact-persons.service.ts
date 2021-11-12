import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { cacheable } from '@datorama/akita';
import { delay, tap } from 'rxjs/operators';
import { GroupedContactPerson } from '@svv/core/models';
import { environment } from '@svv/website/environments/environment';
import { ContactPersonsStore } from './contact-persons.store';

@Injectable({
  providedIn: 'root',
})
export class ContactPersonsService {
  private readonly apiUrl = environment.apiUrl;

  constructor(private store: ContactPersonsStore, private http: HttpClient) {}

  getContactPersons() {
    const request$ = this.http
      .get<GroupedContactPerson[]>(
        `${this.apiUrl}/contact-persons?grouped=true`,
      )
      .pipe(
        delay(250),
        tap(contactPersons => this.store.set(contactPersons)),
      );

    return cacheable(this.store, request$);
  }
}
