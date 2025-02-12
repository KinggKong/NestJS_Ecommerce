import { HttpException, HttpStatus } from '@nestjs/common';
import { ErrorCode, ErrorCodeType } from './errors.code';

export class AppException extends HttpException {
  constructor(error: ErrorCodeType) {
    const errorDetail = ErrorCode[error];
    super({ errorCode: errorDetail.code, message: errorDetail.message }, HttpStatus.BAD_REQUEST);
  }
}