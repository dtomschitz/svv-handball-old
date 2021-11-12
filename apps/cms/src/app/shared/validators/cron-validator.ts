import { AbstractControl, ValidatorFn } from '@angular/forms';
import { CronOption } from '@svv/core/models';
import { isValidCron } from 'cron-validator';

export function cronValidator(cronOptions: CronOption[]): ValidatorFn {
  const crons = cronOptions.map(option => option.key);
  return ({ value }: AbstractControl) => {
    if (value) {
      const valid = crons.includes(value) ? true : isValidCron(value);
      return valid ? null : { invalidCron: true };
    }
  };
}
