import {
  ChangeDetectionStrategy,
  Component,
  forwardRef,
  Input,
} from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';

@Component({
  selector: 'editable-list',
  templateUrl: './editable-list.component.html',
  styleUrls: ['./editable-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => EditableListComponent),
      multi: true,
    },
  ],
})
export class EditableListComponent implements ControlValueAccessor {
  @Input() label: string;
  @Input() placeholder: string;
  @Input() disabled: boolean;

  list: string[] = [];
  inputControl: FormControl;

  onChange: any = () => {};
  onTouched: any = () => {};

  constructor() {
    this.inputControl = new FormControl('');
  }

  addItem() {
    const value = this.inputControl.value;
    if (!value) {
      return;
    }

    this.list = [...this.list, value];
    this.resetInputControl();

    this.onChange(this.list);
    this.onTouched();
  }

  removeItem(value: string) {
    this.list = this.list.filter(item => item !== value);

    this.onChange(this.list);
    this.onTouched();
  }

  writeValue(value: string[]) {
    if (value) {
      this.list = value;
    }
  }

  registerOnChange(fn: (_: any) => {}) {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => {}) {
    this.onTouched = fn;
  }

  resetInputControl() {
    this.inputControl.setValue('');
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
