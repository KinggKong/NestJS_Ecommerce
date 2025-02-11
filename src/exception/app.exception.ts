import { HttpException, HttpStatus } from '@nestjs/common';
import { ErrorCode } from './errors.code';

export class AppException extends HttpException {
  constructor(
    errorCode: ErrorCode,
    status: HttpStatus = HttpStatus.BAD_REQUEST,
  ) {
    super({ errorCode, message: errorCode }, status);
  }
}