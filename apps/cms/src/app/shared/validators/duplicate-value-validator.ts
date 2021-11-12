import { AsyncValidatorFn } from '@angular/forms';
import { Observable } from 'rxjs';
import { first, map } from 'rxjs/operators';

export function duplicateValueValidator(
  values$: Observable<string[]>,
  ignore?: string,
): AsyncValidatorFn {
  return ({ value: input }) => {
    return values$.pipe(
      map(values => {
        if (ignore) {
          return values.filter(value => value !== ignore);
        }
        return values;
      }),
      map(values => {
        const duplicate = values.find(value => value === input) !== undefined;
        return duplicate ? { duplicate: true } : null;
      }),
      first(),
    );
  };
}
