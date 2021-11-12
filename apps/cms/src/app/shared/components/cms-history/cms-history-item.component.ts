import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewEncapsulation,
} from '@angular/core';

@Component({
  selector: 'cms-history-item',
  template: `
    <div
      class="container"
      [class.selected]="selected"
      (click)="openHistory.emit()"
    >
      <div class="timeline">
        <div class="top-line" [class.first-or-last]="isFirst"></div>
        <div class="circle" [class.primary]="isFirst">
          <mat-icon *ngIf="isFirst">star</mat-icon>
        </div>
        <div></div>
        <div class="bottom-line" [class.first-or-last]="isLast"></div>
      </div>
      <div class="text">
        <ng-content></ng-content>
      </div>
    </div>
  `,
  styleUrls: ['./cms-history.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'cms-history-item',
  },
})
export class CmsHistoryItemComponent {
  @Input() selected: boolean;
  @Input() isFirst: boolean;
  @Input() isLast: boolean;

  @Output() openHistory: EventEmitter<void> = new EventEmitter<void>();

  constructor(private changeDetector: ChangeDetectorRef) {}

  setSelected(selected: boolean) {
    this.selected = selected;
    this.changeDetector.detectChanges();
  }

  setIsFirst(isFirst: boolean) {
    this.isFirst = isFirst;
    this.changeDetector.detectChanges();
  }

  setIsLast(isLast: boolean) {
    this.isLast = isLast;
    this.changeDetector.detectChanges();
  }
}
