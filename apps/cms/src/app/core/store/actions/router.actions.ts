import { createAction, props } from '@ngrx/store';
import { NavigationExtras } from '@angular/router';

export const navigate = createAction(
  '[Router] Navigate',
  props<{
    path: any[];
    queryParams?: object;
    extras?: NavigationExtras;
  }>(),
);

export const back = createAction('[Router] Navigate Back');

export const forward = createAction('[Router] Navigate Forward');
