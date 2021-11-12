import { NgModule, ModuleWithProviders } from '@angular/core';
import {
  ErrorTailorDirective,
  ErrorGroupNameDirective,
  ErrorControlNameDirective,
} from './error-tailor.directive';
import {
  ErrorTrailorConfigProvider,
  ErrorTrailorFeatureConfigProvider,
} from './providers';
import { ErrorTailorConfig } from './types';

@NgModule({
  declarations: [
    ErrorTailorDirective,
    ErrorGroupNameDirective,
    ErrorControlNameDirective,
  ],
  exports: [
    ErrorTailorDirective,
    ErrorGroupNameDirective,
    ErrorControlNameDirective,
  ],
})
export class ErrorTailorModule {
  static forRoot(
    config: ErrorTailorConfig,
  ): ModuleWithProviders<ErrorTailorModule> {
    return {
      ngModule: ErrorTailorModule,
      providers: [
        {
          provide: ErrorTrailorConfigProvider,
          useValue: config,
        },
      ],
    };
  }

  static forFeature(
    config?: ErrorTailorConfig,
  ): ModuleWithProviders<ErrorTailorModule> {
    return {
      ngModule: ErrorTailorModule,
      providers: [
        {
          provide: ErrorTrailorFeatureConfigProvider,
          useValue: config ? config : {},
        },
      ],
    };
  }
}
