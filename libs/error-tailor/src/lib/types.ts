export interface ErrorTailorConfig {
  defaultErrors?: Record<string, FormError>;
  groupErrors?: FormGroupErrors[];
  controlErrors?: FormControlErrors[];
}

export interface FormGroupErrors {
  selector: string | string[];
  controls: FormControlErrors[];
}

export interface FormControlErrors {
  selector: string | string[];
  errors: FormErrors;
}

export type FormError = string | ((error: any) => string);

export type FormErrors = Record<string, FormError>;
