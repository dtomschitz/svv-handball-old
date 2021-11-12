import { HttpException, HttpStatus } from '@nestjs/common';
import { ErrorType } from '@svv/core/models';

/**
 * Defines the `ApiException` which is based on the default `HttpException`.
 * This exception will be thrown in case an error occured somewhere in the API
 * or if an error occured in the MongoDB.
 */
export class ApiException extends HttpException {
  /**
   * Constructs a new instance of the ApiException.
   *
   * @param type The error type of the exception.
   * @param status The optional status code of the response. 
   */
  constructor(type: ErrorType, status?: HttpStatus) {
    super(
      {
        type,
        status: status ?? HttpStatus.INTERNAL_SERVER_ERROR,
      },
      status ?? HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
