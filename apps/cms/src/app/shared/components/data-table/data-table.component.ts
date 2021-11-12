import {
  AfterContentInit,
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ContentChildren,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  QueryList,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import {
  MatColumnDef,
  MatTable,
  MatTableDataSource,
} from '@angular/material/table';
import { Subject } from 'rxjs';
import { DataTablePaginatorIntl } from './data-table-paginator';

/**
 * This component is used as the default `Data Table` for all features of the
 * CMS application. In order to keep this component more flexible and dynamic
 * the content projection is used to generated the rows of the data table.
 */
@Component({
  selector: 'data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: MatPaginatorIntl,
      useClass: DataTablePaginatorIntl,
    },
  ],
})
export class DataTableComponent
  implements OnChanges, AfterViewInit, AfterContentInit, OnDestroy {
  private readonly destroy$: Subject<void> = new Subject<void>();

  /**
   * The data which should be displayed inside the data table.
   */
  @Input() data: any[];

  /**
   * Whether searching should be enabled or disabled.
   */
  @Input() enableSearch = true;

  /**
   * The default placeholder for the searchbar.
   */
  @Input() searchPlaceholder = '';

  /**
   * Whether the data rows are expandable or not.
   */
  @Input() expandable = false;

  /**
   * The default columns which are displayed in the data table.
   */
  @Input() displayedColumns: string[];

  /**
   * The default page size options for the paginator
   */
  @Input() pageSizeOptions = [10, 25, 50, 100, 250];

  /**
   * Whether the data is currently loading or not.
   */
  @Input() loading: boolean;

  @Output() rowExpanded: EventEmitter<any> = new EventEmitter<any>();

  @ViewChild(MatTable, { static: true }) table: MatTable<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ContentChildren(MatColumnDef) columnDefs: QueryList<MatColumnDef>;

  dataSource: MatTableDataSource<any>;
  expandedElement: any;

  constructor() {
    this.dataSource = new MatTableDataSource<any>();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  ngAfterContentInit() {
    this.columnDefs.forEach(columnDef => this.table.addColumnDef(columnDef));
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.data) {
      this.dataSource.data = changes.data.currentValue;
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  expandRow(row: any) {
    this.expandedElement = this.expandedElement === row ? undefined : row;
    this.rowExpanded.emit(this.expandedElement);
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  get noData() {
    return this.dataSource.data.length === 0;
  }
}
