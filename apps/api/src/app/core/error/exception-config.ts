import { ErrorType } from '@svv/core/models';

export interface ExceptionConfig {
  model: string;
  errors?: {
    invalidId?: ErrorType;
    notFound?: ErrorType;
  };
}
