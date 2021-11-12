import { InjectionToken } from '@angular/core';
import { ErrorTailorConfig } from './types';

export const ErrorTrailorConfigProvider = new InjectionToken<ErrorTailorConfig>(
  'ErrorTrailorConfigProvider',
);

export const ErrorTrailorFeatureConfigProvider = new InjectionToken<ErrorTailorConfig>(
  'ErrorTrailorFeatureConfigProvider',
);
