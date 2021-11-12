import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ErrorResponse, GroupedContactPerson } from '@svv/core/models';
import { SeoService } from '@svv/website/core/services';
import {
  ContactPersonsQuery,
  ContactPersonsService,
} from '@svv/website/state/contact-persons';

@Component({
  selector: 'contact-persons',
  templateUrl: './contact-persons.component.html',
  styleUrls: ['./contact-persons.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactPersonsComponent implements OnInit, OnDestroy {
  private readonly destroy$: Subject<void> = new Subject<void>();

  groupedContactPersons$: Observable<GroupedContactPerson[]>;
  loading$: Observable<boolean>;
  error$: Observable<ErrorResponse>;

  constructor(
    private seoService: SeoService,
    private contactPersonsService: ContactPersonsService,
    private contactPersonsQuery: ContactPersonsQuery,
  ) {
    this.groupedContactPersons$ = this.contactPersonsQuery.selectAll();
    this.loading$ = this.contactPersonsQuery.selectLoading();
    this.error$ = this.contactPersonsQuery.selectError();
  }

  ngOnInit() {
    this.seoService.setTitle('Ansprechpartner');
    this.contactPersonsService
      .getContactPersons()
      .pipe(takeUntil(this.destroy$))
      .subscribe();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  emptyArray(length: number) {
    return Array(length);
  }
}
