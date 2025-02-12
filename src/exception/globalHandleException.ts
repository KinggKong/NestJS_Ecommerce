import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  BadRequestException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ApiResponse } from '../common/api.response';
import { AppException } from './app.exception';
import { ErrorCode } from './errors.code';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let apiResponse: ApiResponse<string | null>;

    if (exception instanceof AppException) {
      // Xử lý lỗi do người dùng ném ra
      const errorResponse = exception.getResponse() as any;
      apiResponse = new ApiResponse(
        errorResponse.errorCode,
        errorResponse.message,
        null,
        request.url,
      );
      response.status(exception.getStatus()).json(apiResponse);
    } else if (exception instanceof BadRequestException) {
      // Xử lý lỗi validation (tương đương `MethodArgumentNotValidException` trong Spring Boot)
      const errorResponse = exception.getResponse() as any;
      const message = errorResponse.message || ErrorCode.INVALID_KEY.message;
      apiResponse = new ApiResponse(
        ErrorCode.INVALID_KEY.code,
        message,
        null,
        request.url,
      );
      response.status(exception.getStatus()).json(apiResponse);
    } else if (exception instanceof HttpException) {
      // Xử lý các ngoại lệ HTTP khác
      const status = exception.getStatus();
      const errorResponse = exception.getResponse() as any;
      const message = errorResponse.message || 'Unknown error';
      apiResponse = new ApiResponse(status, message, null, request.url);
      response.status(status).json(apiResponse);
    } else {
      // Xử lý tất cả các lỗi khác (tương tự `Exception.class` trong Spring Boot)
      apiResponse = new ApiResponse(
        ErrorCode.UNCATEGORIZED_EXCEPTION.code,
        ErrorCode.UNCATEGORIZED_EXCEPTION.message,
        exception instanceof Error ? exception.message : null,
        request.url,
      );
      response.status(500).json(apiResponse);
    }
  }
}
