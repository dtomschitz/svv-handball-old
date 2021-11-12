import { cronValidator } from './cron-validator';
import { duplicateValueValidator } from './duplicate-value-validator';
import { urlValidator } from './url-validator';

export * from './cron-validator';
export * from './duplicate-value-validator';
export * from './url-validator';

export const CustomValidators = {
  cronValidator,
  duplicateValueValidator,
  urlValidator,
};
