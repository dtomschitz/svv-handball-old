import {
  Directive,
  Optional,
  OnInit,
  OnDestroy,
  ElementRef,
  Input,
  Host,
  Inject,
  Self,
  Renderer2,
} from '@angular/core';
import { FormGroup, FormControl, ValidationErrors, NgControl } from '@angular/forms';
import { MatFormField } from '@angular/material/form-field';
import { Subject, merge, Observable, EMPTY, fromEvent } from 'rxjs';
import { takeUntil, startWith, switchMap } from 'rxjs/operators';
import {
  ErrorTailorConfig,
  FormError,
  FormGroupErrors,
  FormControlErrors,
  FormErrors,
} from './types';
import { ErrorTrailorConfigProvider, ErrorTrailorFeatureConfigProvider } from './providers';

function isObject(item) {
  return item && typeof item === 'object' && !Array.isArray(item);
}

function mergeDeep(target, ...sources) {
  if (!sources.length) {
    return target;
  }

  const source = sources.shift();
  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (!target[key]) {
          Object.assign(target, { [key]: {} });
        }
        mergeDeep(target[key], source[key]);
      } else {
        Object.assign(target, { [key]: source[key] });
      }
    }
  }

  return mergeDeep(target, ...sources);
}

@Directive({ selector: '[errorGroupName]' })
export class ErrorGroupNameDirective {
  @Input('errorGroupName') groupName: string;
}

@Directive({ selector: '[errorControlName]' })
export class ErrorControlNameDirective {
  @Input('errorControlName') controlName: string;
}

@Directive({
  selector: 'mat-error[errorTailor]',
})
export class ErrorTailorDirective implements OnInit, OnDestroy {
  @Input() controlErrorsOnAsync = true;
  @Input() controlErrorsOnBlur = true;
  @Input() controlErrorsOnChange = true;

  private readonly destroy$: Subject<void> = new Subject<void>();

  private config: ErrorTailorConfig;
  private ngControl: NgControl;
  private groupName: string;
  private controlName: string;

  constructor(
    private renderer: Renderer2,
    private matErrorElementRef: ElementRef,
    @Inject(ErrorTrailorConfigProvider) private rootConfig: ErrorTailorConfig,
    @Inject(ErrorTrailorFeatureConfigProvider) private featureConfig: ErrorTailorConfig,

    @Optional() @Host() private matFormField: MatFormField,
    @Optional() @Host() private errorGoupNameDirective: ErrorGroupNameDirective,
    @Optional() @Self() private errorControlNameDirective: ErrorControlNameDirective,
  ) {
    this.config = mergeDeep(this.rootConfig, this.featureConfig);
  }

  ngOnInit() {
    this.ngControl = this.matFormField._control.ngControl;

    if (!this.ngControl) {
      return;
    }

    if (!this.config.defaultErrors && !this.config.controlErrors && !this.config.groupErrors) {
      return;
    }

    if (
      this.ngControl.control.parent instanceof FormGroup &&
      (!this.errorGoupNameDirective || this.errorGoupNameDirective.groupName === '')
    ) {
      return;
    }
    this.groupName = this.errorGoupNameDirective?.groupName;

    if (
      this.ngControl instanceof FormControl &&
      !this.ngControl.parent &&
      (!this.errorControlNameDirective || this.errorControlNameDirective.controlName === '')
    ) {
      return;
    }

    this.controlName =
      this.errorControlNameDirective?.controlName ?? this.ngControl?.name?.toString();

    const statusChanges$ = this.ngControl.statusChanges.pipe(takeUntil(this.destroy$));
    const valueChanges$ = this.ngControl.valueChanges;
    let errorsOnAsync$: Observable<any> = EMPTY;
    let errorsOnBlur$: Observable<any> = EMPTY;
    let errorsOnChange$: Observable<any> = EMPTY;

    const hasAsyncValidator = !!this.ngControl.asyncValidator;
    if (this.controlErrorsOnAsync && hasAsyncValidator) {
      errorsOnAsync$ = statusChanges$.pipe(startWith(true));
    }

    if (this.controlErrorsOnBlur) {
      errorsOnBlur$ = fromEvent(this.matFormField._elementRef.nativeElement, 'focusout').pipe(
        switchMap(() => valueChanges$.pipe(startWith(true))),
      );
    }

    if (this.controlErrorsOnChange) {
      errorsOnChange$ = valueChanges$;
    }

    merge(errorsOnAsync$, errorsOnBlur$, errorsOnChange$)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        const controlErrors = this.ngControl.errors;
        if (controlErrors) {
          const message = this.getErrorMessage(this.groupName, this.controlName, controlErrors);
          if (message) {
            this.setError(message);
          }
        }
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private setError(message: string) {
    this.renderer.setProperty(this.matErrorElementRef.nativeElement, 'innerText', message);
  }

  private getErrorMessage(
    groupName: string,
    controlName: string,
    validationErrors: ValidationErrors,
  ): string {
    const validationKey = Object.keys(validationErrors)[0];
    const validationError = Object.values(validationErrors)[0];

    let error = this.getDefaultError(validationKey);

    if (groupName && controlName) {
      error = this.getGroupError(groupName, controlName, validationKey) ?? error;
    }

    if (!groupName && controlName) {
      error = this.getSingleControlError(controlName, validationKey) ?? error;
    }

    if (error) {
      if (typeof error === 'function') {
        return error(validationError);
      }
      return error;
    }
  }

  private getDefaultError(validatorKey: string): FormError {
    return this.getError(this.config.defaultErrors, validatorKey);
  }

  private getGroupError(groupName: string, controlName: string, validatorKey: string): FormError {
    const control = this.findNestedFormControlErrors(groupName, controlName);
    if (control) {
      return this.getError(control.errors, validatorKey);
    }
  }

  private getSingleControlError(controlName: string, validatorKey: string): FormError {
    const control = this.findFormControlErrors(controlName);
    if (control) {
      return this.getError(control.errors, validatorKey);
    }
  }

  private getError(formErrors: FormErrors, validatorKey: string): FormError {
    return (
      Object.keys(formErrors)
        .filter(key => key === validatorKey)
        .map(key => formErrors[key])[0] ?? undefined
    );
  }

  private findFormControlErrors(controlName: string): FormControlErrors {
    return this.config.controlErrors?.find(this.nameMatch(controlName));
  }

  private findNestedFormControlErrors(groupName: string, controlName: string): FormControlErrors {
    return this.config.groupErrors
      ?.find(this.nameMatch(groupName))
      ?.controls.find(this.nameMatch(controlName));
  }

  private nameMatch(name: string) {
    return (value: FormGroupErrors | FormControlErrors): boolean => {
      if (Array.isArray(value.selector)) {
        return value.selector.includes(name);
      }

      return value.selector === name;
    };
  }
}
