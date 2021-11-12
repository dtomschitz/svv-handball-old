import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  Input,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatChip, MatChipList } from '@angular/material/chips';
import { Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { ChipOptions } from './mat-chip-option.types';

@Component({
  selector: 'mat-chip-options',
  templateUrl: './mat-chip-options.component.html',
  styleUrls: ['./mat-chip-options.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: MatChipOptionsComponent,
      multi: true,
    },
  ],
  host: {
    class: 'mat-chip-options',
  },
})
export class MatChipOptionsComponent
  implements AfterViewInit, OnDestroy, ControlValueAccessor {
  private readonly destroy$: Subject<void> = new Subject<void>();

  @Input() options: ChipOptions;
  @Input() allwaysOne: boolean = true;
  @Input() multiple: boolean = false;

  @ViewChild(MatChipList) chipList!: MatChipList;

  value: string[] = [];
  disabled: boolean = false;

  onChange!: (value: string[]) => void;

  ngAfterViewInit() {
    this.selectChips(this.value);

    this.chipList.chipSelectionChanges
      .pipe(
        map(event => event.source),
        takeUntil(this.destroy$),
      )
      .subscribe(chip => {
        if (chip.selected) {
          this.value = [...this.value, chip.value];
        } else {
          this.value = this.value.filter(option => option !== chip.value);
        }
        this.propagateChange(this.value);
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  writeValue(value: string[]) {
    if (this.chipList && value) {
      this.selectChips(value);
    } else if (value) {
      this.value = value;
    }
  }

  registerOnChange(fn: any) {
    this.onChange = fn;
  }

  registerOnTouched(fn: any) {}

  setDisabledState?(isDisabled: boolean) {
    this.disabled = isDisabled;
  }

  propagateChange(value: string[]) {
    if (this.onChange && !(this.allwaysOne && this.value.length === 0)) {
      this.onChange(value);
    }
  }

  selectChips(value: string[]) {
    this.chipList.chips.forEach(chip => chip.deselect());
    this.chipList.chips
      .filter(chip => value.includes(chip.value))
      .forEach(chip => chip.select());
  }

  toggleSelection(chip: MatChip) {
    if (this.disabled) {
      return;
    }

    if (
      this.allwaysOne &&
      this.value.length === 1 &&
      this.value[0] === chip.value
    ) {
      return;
    }

    chip.toggleSelected();
  }
}
