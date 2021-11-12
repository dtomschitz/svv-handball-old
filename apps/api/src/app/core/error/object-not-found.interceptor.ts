import {
  CallHandler,
  ExecutionContext,
  NestInterceptor,
  Type,
  mixin,
  Inject,
  Optional,
} from '@nestjs/common';
import { tap } from 'rxjs/operators';
import { ErrorType } from '@svv/core/models';
import { ApiException } from './api-exception';
import { Document, Model } from 'mongoose';
import { Request } from 'express';

/**
 * Constructs a new instance of the `ObjectNotFoundInterceptor` which can be
 * used to prevent exceptions which can be raised if the HTTP-Request contains
 * ids which are not associated with any docuements in the respective
 * collection inside the database.
 *
 * If the @param modelToken is undefined the check of whether a document exists
 * will be skipped.
 *
 * @param type The error type which will be send in the error response.
 * @param modelToken The model token in order to access the specific collection.
 * @param options: Further options for validating the id or the response
 */
export function ObjectNotFoundInterceptor<R, M extends Document = any>(
  type: ErrorType,
  options?: {
    modelToken?: string;
    existsFn?: (request: Request) => any;
    validationFn?: (data: R) => boolean;
  },
): Type<NestInterceptor> {
  class MixinInterceptor implements NestInterceptor {
    constructor(
      @Optional() @Inject(options?.modelToken) private model: Model<M>,
    ) {}

    async intercept(context: ExecutionContext, stream$: CallHandler) {
      if (options?.modelToken) {
        const request = context.switchToHttp().getRequest();

        // Checks if there is an document stored in the database which is
        // associated with the given id
        const exists = await this.model.exists(
          options?.existsFn
            ? options?.existsFn(request)
            : { _id: request.params.id },
        );
        if (!exists) {
          throw new ApiException(type ?? ErrorType.OBJECT_NOT_FOUND);
        }
      }

      // In case the response is empty, the ApiException with the default type
      // OBJECT_NOT_FOUND will be thrown
      return stream$.handle().pipe(
        tap(data => {
          if (
            (options?.validationFn && options?.validationFn(data)) ||
            !data ||
            (Array.isArray(data) && data.length === 0)
          ) {
            throw new ApiException(type ?? ErrorType.OBJECT_NOT_FOUND);
          }
        }),
      );
    }
  }

  const Interceptor = mixin(MixinInterceptor);
  return Interceptor as Type<NestInterceptor>;
}
