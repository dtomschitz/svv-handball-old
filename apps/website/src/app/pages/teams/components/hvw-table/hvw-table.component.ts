import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';
import { ErrorResponse, HvwTable } from '@svv/core/models';
import { TablesQuery, TablesService } from '@svv/website/state/tables';

@Component({
  selector: 'hvw-table',
  templateUrl: './hvw-table.component.html',
  styleUrls: ['./hvw-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HVWTableComponent implements OnInit, OnChanges, OnDestroy {
  private readonly destroy$: Subject<void> = new Subject<void>();

  @Input() classId: string;

  table$: Observable<HvwTable>;
  loading$: Observable<boolean>;
  error$: Observable<ErrorResponse>;

  constructor(
    private tablesQuery: TablesQuery,
    private tablesService: TablesService,
  ) {
    this.table$ = this.tablesQuery.selectActive();
    this.loading$ = this.tablesQuery.selectLoading();
    this.error$ = this.tablesQuery.selectError();
  }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.classId && changes.classId.currentValue) {
      this.tablesService
        .getTable(this.classId)
        .pipe(takeUntil(this.destroy$))
        .subscribe();
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  isHomeTeam(name: string) {
    return name.includes('SV Vaihingen');
  }

  emptyArray(n: number): any[] {
    return Array(n);
  }
}
