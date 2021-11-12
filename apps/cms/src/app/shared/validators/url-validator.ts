import { AbstractControl, ValidatorFn } from '@angular/forms';

const urlRegex = new RegExp(
  '/^(?:(?:https?|ftp)://)(?:S+(?::S*)?@)?(?:(?!(?:10|127)(?:.d{1,3}){3})(?!(?:169.254|192.168)(?:.d{1,3}){2})(?!172.(?:1[6-9]|2d|3[0-1])(?:.d{1,3}){2})(?:[1-9]d?|1dd|2[01]d|22[0-3])(?:.(?:1?d{1,2}|2[0-4]d|25[0-5])){2}(?:.(?:[1-9]d?|1dd|2[0-4]d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:.(?:[a-z\u00a1-\uffff]{2,})).?)(?::d{2,5})?(?:[/?#]S*)?$/i',
);

export function urlValidator(): ValidatorFn {
  return ({ value }: AbstractControl) => {
    if (value) {
      const valid = urlRegex.test(value);
      return valid ? null : { invalidUrl: true };
    }
  };
}
