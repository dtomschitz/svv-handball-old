import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { GamesFilterType } from '@svv/core/models';
import { Subject } from 'rxjs';
import { distinctUntilChanged, map, take, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'encounters-filter',
  templateUrl: './encounters-filter.component.html',
  styleUrls: ['./encounters-filter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EncountersFilterComponent
  implements OnInit, AfterViewInit, OnDestroy {
  private readonly destroy$: Subject<void> = new Subject<void>();

  @Output() onFilterChanged = new EventEmitter<GamesFilterType>();

  options = [
    'Alle Spiele',
    'Aktive',
    'Jugend',
    'Gewonnen',
    'Unentschieden',
    'Verloren',
  ];
  filterControl: FormControl;

  constructor(private formBuilder: FormBuilder) {
    this.filterControl = this.formBuilder.control([]);
  }

  ngOnInit() {
    this.filterControl.valueChanges
      .pipe(
        map(options => this.options.indexOf(options[0])),
        distinctUntilChanged(),
        takeUntil(this.destroy$),
      )
      .subscribe(index => {
        this.onFilterChanged.emit(index === -1 ? GamesFilterType.ALL : index);
      });
  }

  ngAfterViewInit() {
    this.filterControl.setValue(this.options[0]);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
