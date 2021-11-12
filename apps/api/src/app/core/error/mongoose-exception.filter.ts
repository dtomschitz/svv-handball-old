import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { ErrorType } from '@svv/core/models';
import { MongoError } from 'mongodb';

interface Errors {
  duplicate?: ErrorType;
}

/**
 * Default Mongoose Exception filter, which tryies to catch all the `MongoDB`
 * related exceptions e.g. the `E11000 duplicate key error dup key` error.
 */
@Catch(MongoError)
export class MongooseExceptionFilter implements ExceptionFilter {
  constructor(private errors: Errors) {}

  catch(exception: MongoError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    if (exception.code === 11000) {
      response.status(500).json({
        type: this.errors?.duplicate ?? ErrorType.DUPLICATE_KEY,
        status: 500,
      });
      return;
    }

    response.status(500).json({
      type: ErrorType.UNKNOWN_MONGODB_ERROR,
      status: 500,
    });
  }
}
