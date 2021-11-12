import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  ContentChildren,
  EventEmitter,
  OnDestroy,
  Output,
  QueryList,
  ViewEncapsulation,
} from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CmsHistoryItemComponent } from './cms-history-item.component';

@Component({
  selector: 'cms-history-list',
  template: '<ng-content select="cms-history-item"></ng-content>',
  styleUrls: ['./cms-history.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'cms-history-list',
  },
})
export class CmsHistoryListComponent implements AfterContentInit, OnDestroy {
  private readonly destroy$: Subject<void> = new Subject<void>();

  @Output() selectionChange: EventEmitter<number> = new EventEmitter<number>();
  @ContentChildren(CmsHistoryItemComponent)
  items: QueryList<CmsHistoryItemComponent>;

  selectedIndex: number;

  ngAfterContentInit() {
    this.setListItems();

    this.items.changes.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.setListItems();
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private setListItems() {
    this.items.forEach((item, index) => {
      item.setSelected(false);

      item.openHistory.pipe(takeUntil(this.destroy$)).subscribe(() => {
        this.selectedIndex = index;
        this.selectionChange.emit(this.selectedIndex);
        this.items.forEach(i => {
          i.setSelected(false);
        });
        item.setSelected(this.selectedIndex === index);
      });
    });
    if (this.items.length !== 0) {
      this.selectedIndex = 0;
      this.items.first.setSelected(true);
    }
  }
}
