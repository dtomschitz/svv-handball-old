import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { HvwCachingResult } from '@svv/core/models';

@Component({
  selector: 'caching-results',
  templateUrl: './caching-results.component.html',
  styleUrls: ['./caching-results.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CachingResultsComponent implements OnChanges {
  @Input() cachingResults: HvwCachingResult[];
  @Input() loading: boolean;
  cachingResult: HvwCachingResult;

  currentIndex = 0;

  ngOnChanges(changes: SimpleChanges) {
    if (changes.cachingResults) {
      this.cachingResult = this.cachingResults[this.currentIndex];
    }
  }

  onSelectionChange(index: number) {
    if (index === this.currentIndex) {
      return;
    }

    this.cachingResult = this.cachingResults[index];
    this.currentIndex = index;
  }

  emptyArray(n: number): any[] {
    return Array(n);
  }
}
