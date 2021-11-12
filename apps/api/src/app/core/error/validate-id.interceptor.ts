import {
  CallHandler,
  ExecutionContext,
  NestInterceptor,
  Type,
  mixin,
} from '@nestjs/common';
import { ErrorType } from '@svv/core/models';
import { ApiException } from './api-exception';
import { Types } from 'mongoose';

/**
 * Constructs a new instance of the `ValidateIdInterceptor` which can be
 * used to prevent exceptions which can be raised if the HTTP-Request contains
 * ids which invalid.
 *
 * @param type The error type which will be send in the error response.
 */
export function ValidateIdInterceptor(type?: ErrorType): Type<NestInterceptor> {
  class MixinInterceptor implements NestInterceptor {
    async intercept(context: ExecutionContext, stream$: CallHandler) {
      const request = context.switchToHttp().getRequest();
      if (request.params.id) {
        const id = request.params.id;

        //Checks if a value is a valid bson ObjectId
        const isValid = Types.ObjectId.isValid(id);
        if (!isValid) {
          throw new ApiException(type ?? ErrorType.INVALID_OBJECT_ID);
        }
      }

      return stream$.handle();
    }
  }

  const Interceptor = mixin(MixinInterceptor);
  return Interceptor as Type<NestInterceptor>;
}
